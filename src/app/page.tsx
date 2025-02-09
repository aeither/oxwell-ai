"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat } from "ai/react";
import {
	Copy,
	RotateCcw,
	SendHorizontal,
	ThumbsDown,
	ThumbsUp,
} from "lucide-react";
import { type FormEvent, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Chat() {
	const { messages, input, handleInputChange, handleSubmit } = useChat();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!input.trim() || isSubmitting) return;

		setIsSubmitting(true);
		await handleSubmit(e);
		setIsSubmitting(false);
	};

	return (
		<div className="flex flex-col h-screen bg-zinc-900 text-zinc-100">
			{/* Header */}
			<header className="w-full p-4 bg-zinc-800 text-center">
				<h1 className="text-2xl font-bold">AI Chat Assistant</h1>
			</header>

			{/* Chat messages */}
			<div className="flex-1 overflow-y-auto p-4 space-y-6">
				{messages.map((message) => (
					<div
						key={message.id}
						className={`flex items-start gap-3 ${
							message.role === "user" ? "justify-end ml-12" : "mr-12"
						}`}
					>
						{message.role === "assistant" && (
							<div className="w-8 h-8 rounded bg-orange-500 flex items-center justify-center text-white flex-shrink-0">
								AI
							</div>
						)}
						<div
							className={`flex flex-col ${
								message.role === "user" ? "items-end" : ""
							}`}
						>
							<div
								className={`group flex flex-col gap-2 ${
									message.role === "user" ? "items-end" : ""
								}`}
							>
								<div
									className={`px-4 py-2 rounded-lg ${
										message.role === "user" ? "bg-zinc-700" : "bg-zinc-800"
									}`}
								>
									<ReactMarkdown>{message.content}</ReactMarkdown>
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
									<button className="p-1.5 hover:bg-zinc-700/50 rounded-md transition-colors">
										<ThumbsUp className="w-4 h-4" />
									</button>
									<button className="p-1.5 hover:bg-zinc-700/50 rounded-md transition-colors">
										<ThumbsDown className="w-4 h-4" />
									</button>
									<button className="p-1.5 hover:bg-zinc-700/50 rounded-md transition-colors">
										<Copy className="w-4 h-4" />
									</button>
									<button className="p-1.5 hover:bg-zinc-700/50 rounded-md transition-colors">
										<RotateCcw className="w-4 h-4" />
									</button>
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
							placeholder="Ask AI Chat or @mention an agent"
							className="w-full bg-zinc-800 border-zinc-700 text-zinc-100 pl-4 pr-32 py-6 rounded-xl focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700 focus:outline-none"
							disabled={isSubmitting}
						/>
						<div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
							<Button
								type="submit"
								variant="ghost"
								size="icon"
								disabled={!input.trim() || isSubmitting}
								className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700/50 transition-colors disabled:opacity-50"
							>
								<SendHorizontal className="w-5 h-5" />
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
