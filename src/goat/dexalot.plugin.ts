import { type Chain, PluginBase, createTool } from "@goat-sdk/core";
import type { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { config } from "dotenv";
import { privateKeyToAccount } from "viem/accounts";
import { z } from "zod";

config();

export class BasicPlugin extends PluginBase<EVMWalletClient> {
    constructor() {
        super("basic", []);
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
            
        ];
    }
}

export function basic() {
    return new BasicPlugin();
}
