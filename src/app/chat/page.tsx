"use client";

import ConnectButton from "@/components/ConnectButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { chains } from "@/lib/constants";
import { ChainId, executeRoute, getQuote, getRoutes, type QuoteRequest } from "@lifi/sdk";
import { useChat } from "ai/react";
import {
	Copy,
	Menu,
	RotateCcw,
	SendHorizontal,
	ThumbsDown,
	ThumbsUp,
} from "lucide-react";
import { type FormEvent, useState } from "react";
import ReactMarkdown from "react-markdown";
import { createPublicClient, http } from "viem";
import { useAccount } from "wagmi";

const mockAssets = [
	{ name: "ETH", network: "Base", amount: "0.0017", value: "$4.59" },
	{ name: "ETH", network: "Arbitrum One", amount: "0.0015", value: "$3.95" },
	{ name: "USDC", network: "Base", amount: "0.8346", value: "$0.83" },
	{ name: "USDC", network: "Avalanche", amount: "0.5999", value: "$0.60" },
	{ name: "POL", network: "Polygon", amount: "0.929", value: "$0.29" },
];

type GetBalanceArgs = {
	isStablecoin: boolean;
	tokenAddress: string;
	walletAddress: string;
	chainId: string;
};

type RouteArgs = {
	fromChainId: number;
	toChainId: number;
	fromTokenAddress: string;
	toTokenAddress: string;
	fromAmount: string;
	fromAddress?: string;
};

export default function Chat() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { address } = useAccount();

	const { messages, input, handleInputChange, handleSubmit, addToolResult, isLoading } =
		useChat({
			maxSteps: 5,
			async onToolCall({ toolCall }) {
				// Handle LiFi tool calls
				switch (toolCall.toolName) {
					case "getBalanceOfTokenByChain": {
						const args = toolCall.args as GetBalanceArgs;
						try {
							const selectedChain = chains.find(
								(chain) => chain.id === Number(args.chainId),
							);
							if (!selectedChain) {
								throw new Error(`Unsupported chain ID: ${args.chainId}`);
							}
							const client = createPublicClient({
								chain: selectedChain,
								transport: http(),
							});
							const balance = await client.readContract({
								address: args.tokenAddress as `0x${string}`,
								abi: [
									{
										inputs: [
											{
											internalType: "address",
												name: "account",
												type: "address",
											},
										],
										name: "balanceOf",
										outputs: [
											{ internalType: "uint256", name: "", type: "uint256" },
										],
										stateMutability: "view",
										type: "function",
									},
								],
								functionName: "balanceOf",
								args: [args.walletAddress as `0x${string}`],
							});

							const decimals = args.isStablecoin ? 6 : 18;
							return balance.toString();
						} catch (error) {
							console.error("Failed to get balance:", error);
							throw error;
						}
					}

					case "getQuote": {
						try {
							const args = toolCall.args as QuoteRequest;
							const result = await getQuote(args);
							return JSON.stringify(result);
						} catch (error) {
							console.error("Failed to get quote:", error);
							throw error;
						}
					}

					case "executeRoute": {
						try {
							const args = toolCall.args as RouteArgs;
							const result = await getRoutes(args);
							if (!result.routes.length) {
								throw new Error("No routes found");
							}

							const route = result.routes[0];
							let routeId: string | undefined;

							const routeExecuted = await executeRoute(route, {
								updateRouteHook(updatedRoute) {
									console.log("Route update:", updatedRoute);
									routeId = updatedRoute.id;
								},
							});

							// Wait for route execution to start
							await new Promise((resolve) => setTimeout(resolve, 1000));

							return JSON.stringify({
								message: "Route execution started",
								routeId,
								route: routeExecuted.id,
							});
						} catch (error) {
							console.error("Failed to execute route:", error);
							throw error;
						}
					}
				}
			},
		});

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!input.trim() || isSubmitting) return;
		setIsSubmitting(true);
		await handleSubmit(e);
		setIsSubmitting(false);
	};

	return (
		<div className="flex h-screen bg-zinc-950">
			<Sheet>
				{/* Header */}
				<header className="fixed top-0 left-0 right-0 flex items-center justify-between p-4 bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-800">
					<SheetTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="text-zinc-400 hover:text-zinc-100"
						>
							<Menu className="w-5 h-5" />
						</Button>
					</SheetTrigger>
					<h1 className="text-xl font-bold text-zinc-100">Oxwell AI</h1>
					<ConnectButton />
				</header>

				{/* Sidebar */}
				<SheetContent
					side="left"
					className="w-[300px] p-0 bg-zinc-950 border-r border-zinc-800"
				>
					<SheetHeader className="sr-only">
						<SheetTitle>Wallet Assets</SheetTitle>
					</SheetHeader>
					<div className="flex flex-col h-full">
						<div className="p-4 border-b border-zinc-800">
							<div className="text-2xl font-bold text-zinc-100">$10.34</div>
							<div className="text-sm text-zinc-400">Total Balance</div>
						</div>
						<div className="flex-1 overflow-auto p-4">
							<div className="space-y-4">
								{mockAssets.map((asset, i) => (
									<div
										// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										key={i}
										className="flex justify-between items-center p-2 rounded-lg hover:bg-zinc-900"
									>
										<div>
											<div className="font-medium text-zinc-100">
												{asset.name}
											</div>
											<div className="text-sm text-zinc-400">
												{asset.network}
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

				{/* Main Content */}
				<main className="flex-1 pt-16 pb-0 h-screen overflow-hidden flex flex-col">
					{/* Chat messages */}
					<div className="flex-1 overflow-y-auto p-4 space-y-6">
						{messages.map((message) => (
							<div
								key={message.id}
								className={`flex items-start gap-3 ${message.role === "user" ? "justify-end ml-12" : "mr-12"}`}
							>
								{message.role === "assistant" && (
									<div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white flex-shrink-0">
										AI
									</div>
								)}
								<div
									className={`flex flex-col ${message.role === "user" ? "items-end" : ""}`}
								>
									<div
										className={`group flex flex-col gap-2 ${message.role === "user" ? "items-end" : ""}`}
									>
										<div
											className={`px-4 py-2 rounded-2xl ${
												message.role === "user"
													? "bg-zinc-800 text-zinc-100"
													: "bg-zinc-900 text-zinc-100"
											}`}
										>
											<ReactMarkdown className="prose dark:prose-invert max-w-none">
												{message.content}
											</ReactMarkdown>
										</div>
										<div className="text-xs text-zinc-500">
											{new Date().toLocaleTimeString("en-US", {
												hour12: false,
												hour: "2-digit",
												minute: "2-digit",
											})}
										</div>
									</div>
									{message.role === "assistant" && (
										<div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
											<Button
												variant="ghost"
												size="icon"
												className="text-zinc-400 hover:text-zinc-100"
											>
												<ThumbsUp className="w-4 h-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="text-zinc-400 hover:text-zinc-100"
											>
												<ThumbsDown className="w-4 h-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="text-zinc-400 hover:text-zinc-100"
											>
												<Copy className="w-4 h-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="text-zinc-400 hover:text-zinc-100"
											>
												<RotateCcw className="w-4 h-4" />
											</Button>
										</div>
									)}
								</div>
							</div>
						))}
					</div>

					{/* Input area */}
					<div className="border-t border-zinc-800 p-4">
						<div className="max-w-4xl mx-auto">
							<form onSubmit={onSubmit} className="relative">
								<Input
									value={input}
									onChange={handleInputChange}
									placeholder="Message Oxwell AI..."
									className="w-full pr-32 py-6 rounded-xl bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-zinc-700"
									disabled={isSubmitting}
								/>
								<div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
									{isLoading ? (
										<Button
											onClick={stop}
											variant="ghost"
											size="icon"
											className="text-zinc-400 hover:text-zinc-100"
										>
											<RotateCcw className="w-5 h-5 animate-spin" />
										</Button>
									) : (
										<Button
											type="submit"
											variant="ghost"
											size="icon"
											disabled={!input.trim() || isSubmitting}
											className="text-zinc-400 hover:text-zinc-100 disabled:opacity-50"
										>
											<SendHorizontal className="w-5 h-5" />
										</Button>
									)}
								</div>
							</form>
						</div>
					</div>
				</main>
			</Sheet>
		</div>
	);
}
