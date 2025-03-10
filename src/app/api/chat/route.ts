import { tools } from "@/lib/tools";
import { openai } from "@ai-sdk/openai";
import { cerebras } from "@ai-sdk/cerebras";
import { streamText } from "ai";

// Allow streaming responses up to 45 seconds
export const maxDuration = 45;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    // model: cerebras("llama-3.3-70b"),
    model: openai("gpt-4o-mini"),
    tools,
    maxSteps: 10,
    messages,
    onStepFinish: (event) => {
      console.log(event.toolResults);
    },
  });

  return result.toDataStreamResponse();
}
