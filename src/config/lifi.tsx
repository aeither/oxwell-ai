"use client";

import { ChainType, EVM, config, createConfig, getChains } from "@lifi/sdk";
import { useSyncWagmiConfig } from "@lifi/wallet-management";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import {
	QueryClient,
	QueryClientProvider,
	useQuery,
} from "@tanstack/react-query";
import { getWalletClient, switchChain } from "@wagmi/core";
import type { FC, PropsWithChildren } from "react";
import { createClient, http } from "viem";
import { arbitrum, base, mainnet, optimism, polygon, scroll } from "viem/chains";
import type { Config, CreateConnectorFn } from "wagmi";
import { WagmiProvider, createConfig as createWagmiConfig } from "wagmi";
import { injected } from "wagmi/connectors";

const queryClient = new QueryClient();

// List of Wagmi connectors
const connectors: CreateConnectorFn[] = [injected()];

// Create Wagmi config with default chain and without connectors
const wagmiConfig: Config = createWagmiConfig({
	chains: [arbitrum, base, mainnet, optimism, polygon, scroll],
	client({ chain }) {
		return createClient({ chain, transport: http() });
	},
});

// Create SDK config using Wagmi actions and configuration
createConfig({
	integrator: "ETHOxford25",
	providers: [
		EVM({
			getWalletClient: () => getWalletClient(wagmiConfig),
			switchChain: async (chainId) => {
				const chain = await switchChain(wagmiConfig, { chainId: chainId });
				return getWalletClient(wagmiConfig, { chainId: chain.id });
			},
		}),
	],
	// We disable chain preloading and will update chain configuration in runtime
	preloadChains: false,
});

const ChainConfigProvider: FC<PropsWithChildren> = ({ children }) => {
	// Load EVM chains from LI.FI API using getChains action from LI.FI SDK
	const { data: chains } = useQuery({
		queryKey: ["chains"] as const,
		queryFn: async () => {
			const chains = await getChains({
				chainTypes: [ChainType.EVM],
			});
			// Update chain configuration for LI.FI SDK
			config.setChains(chains);
			return chains;
		},
	});

	// Synchronize fetched chains with Wagmi config and update connectors
	useSyncWagmiConfig(wagmiConfig, connectors, chains);

	return <>{children}</>;
};

export const CustomWagmiProvider: FC<PropsWithChildren> = ({ children }) => {
	return (
		<QueryClientProvider client={queryClient}>
			<WagmiProvider config={wagmiConfig}>
				<ChainConfigProvider>
					<RainbowKitProvider>{children}</RainbowKitProvider>
				</ChainConfigProvider>
			</WagmiProvider>
		</QueryClientProvider>
	);
};
