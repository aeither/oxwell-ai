import { type Chain, PluginBase, createTool } from "@goat-sdk/core";
import type { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { config } from "dotenv";
import { privateKeyToAccount } from "viem/accounts";
import { z } from "zod";

config();

export class DexalotPlugin extends PluginBase<EVMWalletClient> {
    constructor() {
        super("dexalot", []);
    }

    supportsChain = (chain: Chain) => chain.type === "evm";

    getTools(walletClient: EVMWalletClient) {
        return [
            createTool(
                {
                    name: "getMyWalletAddress",
                    description: "get the wallet address of the owner",
                    parameters: z.object({
                    }),
                },
                async (parameters) => {
                    const walletClient = privateKeyToAccount(
                        `${process.env.PRIVATE_KEY}` as `0x${string}`,
                    );
                    return String(walletClient.address)
                }
            ),
            createTool(
                {
                    name: "getDexalotEnvironments",
                    description: "Get Dexalot trading environments",
                    parameters: z.object({
                    }),
                },
                async (parameters) => {
                    try {
                        const response = await fetch("https://api.dexalot-test.com/privapi/trading/environments");
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        const environments = await response.json();
                        return JSON.stringify(environments);
                    } catch (error) {
                        throw `Failed to get Dexalot environments: ${error}`;
                    }
                }
            ),
            createTool(
                {
                    name: "getDexalotTokens",
                    description: "Get available tokens on Dexalot. Returns the mainnet token list as Dexalot subnet does not allow any ERC20 deployments.",
                    parameters: z.object({
                    }),
                },
                async (parameters) => {
                    try {
                        const response = await fetch("https://api.dexalot-test.com/privapi/trading/tokens");
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        const tokens = await response.json();
                        return JSON.stringify(tokens);
                    } catch (error) {
                        throw `Failed to get Dexalot tokens: ${error}`;
                    }
                }
            ),
        ];
    }
}

export function dexalot() {
    return new DexalotPlugin();
}
