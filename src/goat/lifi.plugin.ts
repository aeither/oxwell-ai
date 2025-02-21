import { chainInfo } from "@/lib/chainInfo";
import { chains } from "@/lib/constants";
import { type Chain, PluginBase, createTool } from "@goat-sdk/core";
import type { EVMWalletClient } from "@goat-sdk/wallet-evm";
import {
    ChainId,
    executeRoute,
    getQuote,
    getRoutes,
    getToken
} from "@lifi/sdk";
import { config } from "dotenv";
import { createPublicClient, formatUnits, http } from "viem";
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
                    name: "getBalanceOfTokenByChain",
                    description: "Get the balance of a token for a specific wallet address. If an 0x address is provided with a token symbol. the address should be the walletAddress",
                    parameters: z.object({
                        isStablecoin: z.boolean().describe("True if the token is a stablecoin such as USDC, USDT, or DAI"),
                        tokenAddress: z.string().describe("The token address to get the balance for. Get address with getTokenByChain"),
                        walletAddress: z.string().describe("The wallet address to get the balance for"),
                        chainId: z.string().describe("The chain id to get the balance for. Get chain id with getChainInfo"),
                    }),
                },
                async (parameters) => {
                    try {
                        const selectedChain = chains.find((chain) => chain.id === Number(parameters.chainId));
                        if (!selectedChain) {
                            throw new Error(`Unsupported chain ID: ${parameters.chainId}`);
                        }
                        const client = createPublicClient({
                            chain: selectedChain,
                            transport: http()
                        });
                        const balance = await client.readContract({
                            address: parameters.tokenAddress as `0x${string}`,
                            abi: [{ "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }],
                            functionName: 'balanceOf',
                            args: [parameters.walletAddress as `0x${string}`],
                        });
                        return parameters.isStablecoin ? formatUnits(balance, 6) : formatUnits(balance, 18);
                    } catch (error) {
                        throw `Failed to get token balance: ${error}`;
                    }
                }
            ),

            createTool(
                {
                    name: "getChainInfo",
                    description: "Get the chain. Get information about all supported chains. should be use to get chain key for getTokenByChain. Always use this tool to get chain key or id",
                    parameters: z.object({}),
                },
                async () => {
                    try {
                        // const response = await fetch('https://li.quest/v1/chains', {
                        //     method: 'GET',
                        //     headers: {
                        //         'accept': 'application/json'
                        //     }
                        // });
                        // if (!response.ok) {
                        //     throw new Error(`HTTP error! status: ${response.status}`);
                        // }
                        // const chainInfo = await response.json();
                        return JSON.stringify(chainInfo);
                    } catch (error) {
                        throw new Error(`Failed to get chain information: ${error}`);
                    }
                }
            ),

            createTool(
                {
                    name: "getTokenByChain",
                    description: "Get token information by its address or symbol and its chain. Assume user wants to know about tokenIf user text get X on Y",
                    parameters: z.object({
                        chain: z.string().describe("Id or key of the chain that contains the token"),
                        token: z.string().describe("Address or symbol of the token on the requested chain"),
                    }),
                },
                async (parameters) => {
                    try {
                        const response = await fetch(`https://li.quest/v1/token?chain=${parameters.chain}&token=${parameters.token}`, {
                            method: 'GET',
                            headers: {
                                'accept': 'application/json'
                            }
                        });
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        const tokenInfo: {
                            address: string;
                            chainId: number;
                            symbol: string;
                            decimals: number;
                            name: string;
                            coinKey: string;
                            logoURI: string;
                            priceUSD: string;
                        } = await response.json();
                        return JSON.stringify(tokenInfo);
                    } catch (error) {
                        return {
                            "message": "/chain must be number, /chain must be equal to one of the allowed values, /chain must match exactly one schema in oneOf",
                            "code": 1011
                        };
                    }
                }
            ),

            createTool(
                {
                    name: "getAmountWithDecimals",
                    description: "Get the amount with token decimals",
                    parameters: z.object({
                        fromAmount: z.string().describe("The amount to convert"),
                        chainId: z.nativeEnum(ChainId).describe("The chain ID"),
                        tokenAddress: z.string().describe("The token address"),
                    }),
                },
                async (parameters) => {
                    try {
                        const tokenInfo = await getToken(parameters.chainId, parameters.tokenAddress);
                        const amountWithDecimals = (Number(parameters.fromAmount) * 10 ** tokenInfo.decimals).toString();
                        return amountWithDecimals;
                    } catch (error) {
                        throw new Error(`Failed to get amount with decimals: ${error}`);
                    }
                }
            ),

            createTool(
                {
                    name: "getQuote",
                    description: "Get a quote for a LiFi swap.",
                    parameters: z.object({
                        fromAddress: z.string().describe("The address from which the tokens are being transferred"),
                        fromChain: z.nativeEnum(ChainId).describe("The source chain ID"),
                        toChain: z.nativeEnum(ChainId).describe("The destination chain ID"),
                        fromToken: z.string().describe("The address of the token to swap from"),
                        toToken: z.string().describe("The address of the token to swap to"),
                        fromAmount: z.string().describe("The amount of tokens to swap"),
                    }),
                },
                async (parameters) => {
                    console.log('🚀 ~ LiFiPlugin ~ parameters:', parameters);

                    try {
                        const quote = await getQuote(parameters);
                        console.log("🚀 ~ LiFiPlugin ~ quote:", quote)
                        return JSON.stringify(quote);
                    } catch (error) {
                        return JSON.stringify(error);
                        // throw new Error(`Failed to get quote: ${error}`);
                    }
                }
            ),

            createTool(
                {
                    name: "executeRoute",
                    description: "Execute a LiFi route.",
                    parameters: z.object({
                        fromChainId: z.nativeEnum(ChainId).describe("The source chain ID"),
                        toChainId: z.nativeEnum(ChainId).describe("The destination chain ID"),
                        fromTokenAddress: z.string().describe("The address of the token to swap from. Use 0x0000000000000000000000000000000000000000 for native token"),
                        toTokenAddress: z.string().describe("The address of the token to swap to. Use 0x0000000000000000000000000000000000000000 for native token"),
                        fromAmount: z.string().describe("The amount of tokens to swap"),
                        fromAddress: z.string().describe("The address from which the tokens are being transferred"),
                    }),
                },
                async (parameters) => {
                    try {
                        const result = await getRoutes(parameters);

                        if (result.routes.length === 0) {
                            return JSON.stringify({ error: "No routes found" });
                        }

                        const route = result.routes[0];

                        executeRoute(route, {
                            updateRouteHook(route) {
                                console.log("🚀 ~ executedRoute:", route);
                                console.log(route.id);
                            },
                        });

                        return JSON.stringify({ message: "executed successfully, here is the route used", route: result.routes[0] });   
                    } catch (error) {
                        console.error("Failed to execute route:", error);
                        throw error;
                    }
                }
            ),


            createTool(
                {
                    name: "getError",
                    description: "Get an Error.",
                    parameters: z.object({
                        address: z.string().describe("The address from which the tokens are being transferred"),
                    }),
                },
                async (parameters) => {

                    try {
                        throw new Error("Failed");
                    } catch (error) {
                        console.error("❌ ",error);
                        return JSON.stringify({ message: "Something went wrong. Please check if the input parameters are correct", params: parameters });
                    }
                }
            ),

        ];
    }
}

export function lifi() {
    return new LiFiPlugin();
}
