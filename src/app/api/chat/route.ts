import { tools } from "@/lib/tools";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 45 seconds
export const maxDuration = 45;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
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
