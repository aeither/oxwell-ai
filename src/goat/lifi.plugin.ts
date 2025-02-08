import { type Chain, PluginBase, createTool } from "@goat-sdk/core";
import type { EVMWalletClient } from "@goat-sdk/wallet-evm";
import {
    ChainId,
    executeRoute,
    getQuote,
    getRoutes
} from "@lifi/sdk";
import { config } from "dotenv";
import { z } from "zod";

config();

export class LiFiPlugin extends PluginBase<EVMWalletClient> {
    constructor() {
        super("lifi", []);
    }

    supportsChain = (chain: Chain) => chain.type === "evm";

    getTools(walletClient: EVMWalletClient) {
        return [
            createTool(
                {
                    name: "executeRoute",
                    description: "Execute a LiFi route.",
                    parameters: z.object({
                        fromChainId: z.number().describe("The source chain ID"),
                        toChainId: z.number().describe("The destination chain ID"),
                        fromTokenAddress: z
                            .string()
                            .describe("The address of the token to swap from"),
                        toTokenAddress: z
                            .string()
                            .describe("The address of the token to swap to"),
                        fromAmount: z.string().describe("The amount of tokens to swap"),
                        fromAddress: z
                            .string()
                            .describe(
                                "The address from which the tokens are being transferred"
                            ),
                    }),
                },

                async (parameters) => {
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
                        return JSON.stringify(executedRoute);
                    } catch (error) {
                        console.error("Failed to execute route:", error);
                        return JSON.stringify({
                            error: `Failed to execute route: ${error.message}`,
                        });
                    }
                }
            ),

            createTool(
                {
                    name: "getQuote",
                    description: "Get a quote for a LiFi swap.",
                    parameters: z.object({
                        fromAddress: z
                            .string()
                            .describe(
                                "The address from which the tokens are being transferred"
                            ),
                        fromChain: z.nativeEnum(ChainId).describe("The source chain ID"),
                        toChain: z.nativeEnum(ChainId).describe("The destination chain ID"),
                        fromToken: z
                            .string()
                            .describe("The address of the token to swap from"),
                        toToken: z.string().describe("The address of the token to swap to"),
                        fromAmount: z.string().describe("The amount of tokens to swap"),
                    }),
                },
                async (parameters) => {
                    try {
                        const quote = await getQuote({
                            fromAddress: parameters.fromAddress,
                            fromChain: parameters.fromChain,
                            toChain: parameters.toChain,
                            fromToken: parameters.fromToken,
                            toToken: parameters.toToken,
                            fromAmount: parameters.fromAmount,
                        });
                        return JSON.stringify(quote);
                    } catch (error) {
                        throw new Error(`Failed to get quote: ${error}`);
                    }
                }
            ),
        ];
    }
}

export function lifi() {
    return new LiFiPlugin();
}
