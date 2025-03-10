"use client";

import { configureLifiChains, projectId, wagmiAdapter } from "@/config/appkit";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { arbitrum, base, bsc, mantle } from "@reown/appkit/networks";
import { createAppKit } from "@reown/appkit/react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";

const queryClient = new QueryClient();

if (!projectId) {
  throw new Error("Project ID is not defined");
}

const metadata = {
	name: "Oxwell AI",
	description: "Oxwell AI - Your Web3 Assistant",
	url: "https://oxwell.ai",
	icons: ["https://oxwell.ai/favicon.ico"],
};

const modal = createAppKit({
	adapters: [wagmiAdapter],
	projectId,
	networks: [arbitrum, base, mantle, bsc],
	defaultNetwork: mantle,
	metadata: metadata,
	features: {
		analytics: true,
	},
});

function ChainConfigProvider({ children }: { children: ReactNode }) {
  // Load and configure LiFi chains
  const { data: chains } = useQuery({
    queryKey: ["chains"] as const,
    queryFn: configureLifiChains,
  });

  return <>{children}</>;
}

function AppKitProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies,
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>
        <ChainConfigProvider>
          <RainbowKitProvider>{children}</RainbowKitProvider>
        </ChainConfigProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default AppKitProvider;
