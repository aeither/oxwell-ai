import { ChainId, EVM, createConfig, getQuote } from '@lifi/sdk';
import { config } from 'dotenv';
import type { Chain } from 'viem';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { arbitrum, base, mainnet, optimism, polygon, scroll } from 'viem/chains';
config();

const account = privateKeyToAccount(`${process.env.PRIVATE_KEY}` as `0x${string}`)

const chains = [arbitrum, mainnet, optimism, polygon, scroll, base]

const client = createWalletClient({
    account,
    chain: mainnet,
    transport: http(),
})

createConfig({
    integrator: 'dappname',
    providers: [
        EVM({
            getWalletClient: async () => client,
            switchChain: async (chainId) =>
                // Switch chain by creating a new wallet client
                createWalletClient({
                    account,
                    chain: chains.find((chain) => chain.id === chainId) as Chain,
                    transport: http(),
                }),
        }),
    ],
})

const main = async () => {
    console.log("hello world");

    const quote = await getQuote({
        fromAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
        fromChain: ChainId.ARB,
        toChain: ChainId.OPT,
        fromToken: '0x0000000000000000000000000000000000000000',
        toToken: '0x0000000000000000000000000000000000000000',
        fromAmount: '1000000000000000000',
    })
    console.log("🚀 ~ main ~ quote:", quote)
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
