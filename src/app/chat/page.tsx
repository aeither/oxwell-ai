"use client";

import { useChat } from "ai/react";

export default function Chat() {
	const { messages, input, handleInputChange, handleSubmit } = useChat();
	return (
		<div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
			{messages.map((m) => (
				<div key={m.id} className="whitespace-pre-wrap">
					{m.role === "user" ? "User: " : "AI: "}
					{m.content}
				</div>
			))}

			<form onSubmit={handleSubmit}>
				<input
					className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
					value={input}
					placeholder="get quotes from 0xA830Cd34D83C10Ba3A8bB2F25ff8BBae9BcD0125 on chain id 42161 from 1000000000000000000 for token 0x0000000000000000000000000000000000000000 amount to 0x0000000000000000000000000000000000000000 on chain id 10"
					onChange={handleInputChange}
				/>
			</form>
		</div>
	);
}