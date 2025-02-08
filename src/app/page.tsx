'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CustomWagmiProvider } from '../config/lifi';

const queryClient = new QueryClient();

export default function Home() {
  return (
			<QueryClientProvider client={queryClient}>
				<CustomWagmiProvider>
					<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
						Test
            <ConnectButton />
					</div>
				</CustomWagmiProvider>
			</QueryClientProvider>
		);
}
