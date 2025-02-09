import readline from "node:readline";

import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

import { lifi } from "@/goat";
import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { viem } from "@goat-sdk/wallet-viem";

require("dotenv").config();

const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);

const walletClient = createWalletClient({
	account,
	transport: http(process.env.RPC_PROVIDER_URL),
	chain: base,
});

(async () => {
	const tools = await getOnChainTools({
		wallet: viem(walletClient as any),
		plugins: [lifi()],
	});

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	while (true) {
		const prompt = await new Promise<string>((resolve) => {
			rl.question('Enter your prompt (or "exit" to quit): ', resolve);
		});

		if (prompt === "exit") {
			rl.close();
			break;
		}

		console.log("\n-------------------\n");
		console.log("TOOLS CALLED");
		console.log("\n-------------------\n");

		console.log("\n-------------------\n");
		console.log("RESPONSE");
		console.log("\n-------------------\n");
		try {
			const result = await generateText({
				model: openai("gpt-4o-mini"),
				tools: tools,
				maxSteps: 10, // Maximum number of tool invocations per request
				prompt: prompt,
				onStepFinish: (event) => {
					console.log(event.toolResults);
				},
			});
			console.log(result.text);
		} catch (error) {
			console.error(error);
		}
		console.log("\n-------------------\n");
	}
})();

// PROMPT
// get quotes from 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045 on chain id 42161 from 1000000000000000000 for token 0x0000000000000000000000000000000000000000 amount to 0x0000000000000000000000000000000000000000 on chain id 10
