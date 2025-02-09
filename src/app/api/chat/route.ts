import { basic } from "@/goat/basic.plugin";
import { lifi } from "@/goat/lifi.plugin";
import { chains } from "@/lib/constants";
import { openai } from "@ai-sdk/openai";
import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { viem } from "@goat-sdk/wallet-viem";
import { EVM, createConfig, executeRoute, getRoutes } from "@lifi/sdk";
import { streamText, tool } from "ai";
import { createWalletClient, http, type Chain } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrum, mainnet, optimism, polygon, scroll } from "viem/chains";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
	const { messages } = await req.json();

	const walletClient = privateKeyToAccount(
		`${process.env.PRIVATE_KEY}` as `0x${string}`,
	);

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
	const tools = await getOnChainTools({
		wallet: viem(walletClient as any),
		plugins: [lifi(), basic()],
	});

	const result = streamText({
		model: openai("gpt-4o-mini"),
		tools: tools,
		maxSteps: 10,

		messages: messages,
		onStepFinish: (event) => {
			console.log(event.toolResults);
		},
	});

	return result.toDataStreamResponse();
}
