"use client";

import { Button } from "@/components/ui/button";
import { ChainId, executeRoute, getQuote, getRoutes } from "@lifi/sdk";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { parseEther } from "viem";
import { useAccount } from "wagmi";

export default function Home() {
	const [quote, setQuote] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const [executing, setExecuting] = useState(false);
	const { address } = useAccount();

	const handleGetQuote = async () => {
		if (!address) {
			console.log("Please connect your wallet first");
			return;
		}
    
		try {
			setLoading(true);
			const quoteResult = await getQuote({
				fromAddress: address,
				fromChain: ChainId.BAS,
				toChain: ChainId.ARB,
				fromToken: "0x0000000000000000000000000000000000000000",
				toToken: "0x0000000000000000000000000000000000000000",
				fromAmount: parseEther("0.00001").toString(), // around 2 cents
			});
			console.log("🚀 ~ handleGetQuote ~ quoteResult:", quoteResult);
			setQuote(quoteResult);
		} catch (error) {
			console.error("Error getting quote:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleExecute = async () => {
		if (!quote || !address) return;

		try {
			setExecuting(true);
			// First get routes using the quote parameters
			const routesResult = await getRoutes({
				fromChainId: quote.action.fromChainId,
				toChainId: quote.action.toChainId,
				fromTokenAddress: quote.action.fromToken.address,
				toTokenAddress: quote.action.toToken.address,
				fromAmount: quote.action.fromAmount,
				fromAddress: address,
			});

			const route = routesResult.routes[0];

			// Execute the first route
			const executedRoute = await executeRoute(route, {
				updateRouteHook(updatedRoute) {
					console.log("Route updated:", updatedRoute);
				},
			});

			console.log("🚀 ~ executedRoute:", executedRoute);
			alert("Transaction executed successfully!");
		} catch (error) {
			console.error("Error executing route:", error);
			alert("Failed to execute transaction. See console for details.");
		} finally {
			setExecuting(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-8">
			<div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
				<h1 className="text-3xl font-bold text-center mb-8">
					Cross-Chain Token Swap
				</h1>

				<div className="flex justify-center mb-8">
					<ConnectButton />
				</div>

				<div className="space-y-6">
					<div className="bg-gray-100 p-6 rounded-lg">
						<h2 className="text-xl font-semibold mb-4">Step 1: Get Quote</h2>
						<Button
							onClick={handleGetQuote}
							className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out"
							disabled={loading}
						>
							{loading ? (
								<span className="flex items-center justify-center">
									{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
									<svg
										className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										/>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										/>
									</svg>
									Get Quote
								</span>
							) : (
								"Get Quote"
							)}
						</Button>
					</div>

					{quote && (
						<div className="bg-gray-100 p-6 rounded-lg">
							<h2 className="text-xl font-semibold mb-4">
								Step 2: Review Quote
							</h2>
							<div className="bg-white p-4 rounded-md shadow-inner mb-4">
								<pre className="whitespace-pre-wrap text-sm">
									{JSON.stringify(quote, null, 2)}
								</pre>
							</div>
							<Button
								onClick={handleExecute}
								className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out"
								disabled={executing || !address}
							>
								{executing ? (
									<span className="flex items-center justify-center">
										{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
										<svg
											className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											/>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											/>
										</svg>
										Executing Swap...
									</span>
								) : (
									"Execute Swap"
								)}
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
