"use client";

import ConnectButton from "@/components/ConnectButton";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import {
	PromptInput,
	PromptInputAction,
	PromptInputActions,
	PromptInputTextarea,
} from "@/components/ui/prompt-input";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { chains } from "@/lib/constants";
import { useChat } from "@ai-sdk/react";
import {
	executeRoute,
	getQuote,
	getRoutes,
	type QuoteRequest,
} from "@lifi/sdk";
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

	const {
		messages,
		input,
		handleInputChange,
		handleSubmit,
		addToolResult,
		isLoading,
	} = useChat({
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
						console.log("🚀 ~ onToolCall ~ args:", args);
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
				<Sidebar />

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
							<PromptInput
								value={input}
								onValueChange={(value: string) =>
									handleInputChange({
										target: { value },
									} as React.ChangeEvent<HTMLTextAreaElement>)
								}
								isLoading={isLoading}
								onSubmit={onSubmit}
								className="w-full relative"
							>
								<div className="relative">
									<PromptInputTextarea
										placeholder="Message Oxwell AI..."
										className="bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-zinc-700 pr-12"
										disabled={isSubmitting}
									/>
									<PromptInputActions className="absolute right-2 top-1/2 -translate-y-1/2">
										<PromptInputAction
											tooltip={isLoading ? "Stop generation" : "Send message"}
										>
											<Button
												type="submit"
												variant="ghost"
												size="icon"
												disabled={!input.trim() || isSubmitting}
												className="text-zinc-400 hover:text-zinc-100 disabled:opacity-50"
												onClick={onSubmit}
											>
												{isLoading ? (
													<RotateCcw className="w-5 h-5 animate-spin" />
												) : (
													<SendHorizontal className="w-5 h-5" />
												)}
											</Button>
										</PromptInputAction>
									</PromptInputActions>
								</div>
							</PromptInput>
						</div>
					</div>
				</main>
			</Sheet>
		</div>
	);
}
