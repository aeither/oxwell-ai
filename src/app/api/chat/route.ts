import { lifi } from "@/goat/lifi.plugin";
import { openai } from "@ai-sdk/openai";
import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { viem } from "@goat-sdk/wallet-viem";
import { EVM, createConfig, executeRoute, getRoutes } from "@lifi/sdk";
import { streamText } from "ai";
import { Chain, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrum, mainnet, optimism, polygon, scroll } from "viem/chains";
import { generateText, tool } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const lifiTool = tool({
  description: "Get the weather in a location",
  parameters: z.object({
    fromChainId: z.number().describe("The source chain ID"),
    toChainId: z.number().describe("The destination chain ID"),
    fromTokenAddress: z
      .string()
      .describe("The address of the token to swap from"),
    toTokenAddress: z.string().describe("The address of the token to swap to"),
    fromAmount: z.string().describe("The amount of tokens to swap"),
    fromAddress: z
      .string()
      .describe("The address from which the tokens are being transferred"),
  }),
  execute: async (parameters) => {
    try {
      const result = await getRoutes({
        fromChainId: parameters.fromChainId,
        toChainId: parameters.toChainId,
        fromTokenAddress: parameters.fromTokenAddress,
        toTokenAddress: parameters.toTokenAddress,
        fromAmount: parameters.fromAmount,
        fromAddress: parameters.fromAddress,
      });

      if (result.routes.length === 0) {
        return JSON.stringify({ error: "No routes found" });
      }

      const route = result.routes[0];

      const executedRoute = await executeRoute(route, {
        updateRouteHook(route) {
          console.log(route);
        },
      });

      console.log("🚀 ~ executedRoute:", executedRoute);
      return {
        executed: executedRoute,
      };
    } catch (error) {
      console.error("Failed to execute route:", error);
      return {
        error: `Failed to execute route: ${error.message}`,
      };
    }
  },
});

export async function POST(req: Request) {
  const { messages } = await req.json();
  // const tools = await getOnChainTools({
  //   wallet: viem(walletClient),
  //   plugins: [lifi({ apiKey: process.env.LIFI_API_KEY as string })],
  // });
  const walletClient = privateKeyToAccount(
    `${process.env.PRIVATE_KEY}` as `0x${string}`
  );

  const chains = [arbitrum, mainnet, optimism, polygon, scroll];

  const client = createWalletClient({
    account: walletClient,
    chain: mainnet,
    transport: http(),
  });

  createConfig({
    integrator: "dappname",
    providers: [
      EVM({
        getWalletClient: async () => client,
        switchChain: async (chainId) =>
          // Switch chain by creating a new wallet client
          createWalletClient({
            account: walletClient,
            chain: chains.find((chain) => chain.id === chainId) as Chain,
            transport: http(),
          }),
      }),
    ],
  });

  const result = streamText({
    model: openai("gpt-4o-mini"),
    tools: {
      lifiTool,
    },
    maxSteps: 10,
    messages: messages,
    onStepFinish: (event) => {
      console.log(event.toolResults);
    },
  });

  return result.toDataStreamResponse();
}
