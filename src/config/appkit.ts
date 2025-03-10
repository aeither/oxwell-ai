import { ChainType, createConfig as createLifiConfig, EVM, getChains, config as lifiConfig } from '@lifi/sdk'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { arbitrum, base, bsc, mantle } from '@reown/appkit/networks'
import { cookieStorage, createStorage, getWalletClient, switchChain } from '@wagmi/core'
import { createClient, http } from 'viem'

export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID

if (!projectId) {
  throw new Error('Reown Project ID is not defined')
}

export const networks = [arbitrum, base, mantle, bsc]

// Create Wagmi adapter with cookie storage for SSR
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks,
  client({ chain }) {
    return createClient({ chain, transport: http() })
  }
})

// Initialize LiFi SDK with Wagmi integration
// createLifiConfig({
//   integrator: "OxwellAI",
//   providers: [
//     EVM({
//       getWalletClient: () => getWalletClient(wagmiAdapter.wagmiConfig),
//       switchChain: async (chainId) => {
//         const chain = await switchChain(wagmiAdapter.wagmiConfig, { chainId: chainId })
//         return getWalletClient(wagmiAdapter.wagmiConfig, { chainId: chain.id })
//       },
//     }),
//   ],
//   preloadChains: false,
// })

// Export Wagmi config for use in other parts of the app
export const config = wagmiAdapter.wagmiConfig

// Function to load and configure LiFi chains
export async function configureLifiChains() {
  const chains = await getChains({
    chainTypes: [ChainType.EVM],
  })
  lifiConfig.setChains(chains)
  return chains
}
