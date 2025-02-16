"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { chains } from "@/lib/constants";
import { useEffect, useState } from "react";
import { useAccount, useBalance } from "wagmi";

type Asset = {
	name: string;
	network: string;
	amount: string;
	value: string;
	symbol: string;
	price: number;
};

export default function Sidebar() {
	const [assets, setAssets] = useState<Asset[]>([]);
	const [totalValue, setTotalValue] = useState<number>(0);
	const { address } = useAccount();

	useEffect(() => {
		const fetchBalancesAndPrices = async () => {
			if (!address) return;

			try {
				const API_URL = "https://api.coingecko.com/api/v3/simple/price";
				const COIN_IDS = [
					"ethereum",
					"matic-network",
					"avalanche-2",
					"mantle",
					"arbitrum",
					"binancecoin",
					"optimism",
				];
				const VS_CURRENCY = "usd";

				const response = await fetch(
					`${API_URL}?ids=${COIN_IDS.join(",")}&vs_currencies=${VS_CURRENCY}`,
					{
						headers: {
							"x-cg-demo-api-key": process.env.NEXT_PUBLIC_COINGECKO_API_KEY || ""
						}
					}
				);

				const prices = await response.json();
				console.log("CoinGecko Prices:", JSON.stringify(prices, null, 2));

				const balancePromises = chains.map(async (chain) => {
					try {
						const balance = await fetch(
							`/api/balance?address=${address}&chainId=${chain.id}`,
						);
						const balanceData = await balance.json();
						console.log(`Balance for chain ${chain.id}:`, balanceData);

						const chainMapping: { [key: number]: string } = {
							1: "ethereum",
							137: "matic-network",
							43114: "avalanche-2",
							5000: "mantle",
							42161: "arbitrum",
							56: "binancecoin",
							10: "optimism",
						};

						const coinGeckoId = chainMapping[chain.id];
						console.log(`Chain ${chain.id} mapped to CoinGecko ID:`, coinGeckoId);
						console.log(`Price data for ${coinGeckoId}:`, prices[coinGeckoId]);
						
						const price = coinGeckoId && prices[coinGeckoId] ? prices[coinGeckoId].usd : 0;
						console.log(`Final price for ${coinGeckoId}:`, price);
						
						const amount = Number.parseFloat(balanceData.formatted || "0");
						const value = amount * price;

						return {
							name: chain.nativeCurrency.name,
							symbol: chain.nativeCurrency.symbol,
							network: chain.name,
							amount: amount.toFixed(4),
							value: `$${value.toFixed(2)}`,
							price,
						};
					} catch (error) {
						console.error(
							`Error fetching balance for chain ${chain.id}:`,
							error,
						);
						return null;
					}
				});

				const balances = (await Promise.all(balancePromises)).filter(
					Boolean,
				) as Asset[];
				const total = balances.reduce(
					(sum, asset) => sum + Number.parseFloat(asset.value.substring(1)),
					0,
				);

				setAssets(balances);
				setTotalValue(total);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchBalancesAndPrices();
		const interval = setInterval(fetchBalancesAndPrices, 30000);
		return () => clearInterval(interval);
	}, [address]);

	return (
		<SheetContent
			side="left"
			className="w-[300px] p-0 bg-zinc-950 border-r border-zinc-800"
		>
			<SheetHeader className="sr-only">
				<SheetTitle>Wallet Assets</SheetTitle>
			</SheetHeader>
			<div className="flex flex-col h-full">
				<div className="p-4 border-b border-zinc-800">
					<div className="text-2xl font-bold text-zinc-100">
						${totalValue.toFixed(2)}
					</div>
					<div className="text-sm text-zinc-400">Total Balance</div>
				</div>
				<div className="flex-1 overflow-auto p-4">
					<div className="space-y-4">
						{assets.map((asset, i) => (
							<div
								key={`${asset.network}-${asset.symbol}`}
								className="flex justify-between items-center p-2 rounded-lg hover:bg-zinc-900"
							>
								<div>
									<div className="font-medium text-zinc-100">
										{asset.symbol}
									</div>
									<div className="text-sm text-zinc-400">{asset.network}</div>
									<div className="text-xs text-zinc-500">
										${asset.price.toFixed(2)} USD
									</div>
								</div>
								<div className="text-right">
									<div className="font-medium text-zinc-100">
										{asset.amount}
									</div>
									<div className="text-sm text-zinc-400">{asset.value}</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</SheetContent>
	);
}
