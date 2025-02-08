import { lifi } from '@/goat/lifi.plugin';
import { openai } from '@ai-sdk/openai';
import { getOnChainTools } from '@goat-sdk/adapter-vercel-ai';
import { viem } from '@goat-sdk/wallet-viem';
import { streamText } from 'ai';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mainnet } from 'viem/chains';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
    const { messages } = await req.json();

    const account = privateKeyToAccount(`${process.env.PRIVATE_KEY}` as `0x${string}`)

    const walletClient = createWalletClient({
        account,
        chain: mainnet,
        transport: http(),
    })

    const tools = await getOnChainTools({
        wallet: viem(walletClient),
        plugins: [lifi({ apiKey: process.env.LIFI_API_KEY as string })],
    });

    const result = streamText({
        model: openai("gpt-4o-mini"),
        tools: tools,
        maxSteps: 10,
        messages: messages,
        onStepFinish: (event) => {
            console.log(event.toolResults);
        },
    });

    return result.toDataStreamResponse();
}