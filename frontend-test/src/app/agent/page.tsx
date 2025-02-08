"use client";

import { lifi } from "@/goat";
import { openai } from "@ai-sdk/openai";
import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { viem } from "@goat-sdk/wallet-viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { generateText } from "ai";
import { useState } from "react";
import { useAccount, useWalletClient } from "wagmi";

export default function Home() {
	const [result, setResult] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const { address } = useAccount();
	const { data: walletClient, isError, isLoading } = useWalletClient();

	const handleGenerateQuote = async () => {
		if (!address) {
			console.log("Please connect your wallet first");
			return;
		}

		try {
			setLoading(true);

			const tools = await getOnChainTools({
				wallet: viem(walletClient),
				plugins: [lifi({ apiKey: process.env.LIFI_API_KEY as string })],
			});

			const prompt = `get quotes from ${address} on chain id 42161 from 1000000000000000000 for token 0x0000000000000000000000000000000000000000 amount to 0x0000000000000000000000000000000000000000 on chain id 10`;

			const generatedResult = await generateText({
				model: openai("gpt-4o-mini"),
				tools: tools,
				maxSteps: 10,
				prompt: prompt,
				onStepFinish: (event) => {
					console.log(event.toolResults);
				},
			});

			setResult(generatedResult.text);
		} catch (error) {
			console.error("Error generating quote:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-8">
			<div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
				<h1 className="text-3xl font-bold text-center mb-8">
					Cross-Chain Token Quote (Vercel AI)
				</h1>

				<div className="flex justify-center mb-8">
					<ConnectButton />
				</div>

				<div className="space-y-6">
					<div className="bg-gray-100 p-6 rounded-lg">
						<h2 className="text-xl font-semibold mb-4">Generate Quote</h2>
						{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
						<button
							onClick={handleGenerateQuote}
							className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out"
							disabled={loading}
						>
							{loading ? "Generating Quote..." : "Generate Quote"}
						</button>
					</div>

					{result && (
						<div className="bg-gray-100 p-6 rounded-lg">
							<h2 className="text-xl font-semibold mb-4">Generated Result</h2>
							<div className="bg-white p-4 rounded-md shadow-inner mb-4">
								<pre className="whitespace-pre-wrap text-sm">{result}</pre>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
