import { EVM, createConfig, executeRoute, getRoutes } from '@lifi/sdk';
import { config } from 'dotenv';
import type { Chain } from 'viem';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { arbitrum, mainnet, optimism, polygon, scroll } from 'viem/chains';
config();

const account = privateKeyToAccount(`${process.env.PRIVATE_KEY}` as `0x${string}`)

const chains = [arbitrum, mainnet, optimism, polygon, scroll]

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
const result = await getRoutes({
    fromChainId: 42161, // Arbitrum
    toChainId: 10, // Optimism
    fromTokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // USDC on Arbitrum
    toTokenAddress: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', // DAI on Optimism
    fromAmount: '10000000', // 10 USDC
    // The address from which the tokens are being transferred.
    fromAddress: account.address,
})

const route = result.routes[0]

const executedRoute = await executeRoute(route, {
    // Gets called once the route object gets new updates
    updateRouteHook(route) {
        console.log(route)
    },
})
console.log("🚀 ~ executedRoute:", executedRoute)
