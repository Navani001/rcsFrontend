import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';


export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-1.5-pro-latest"),
    system:"you are a ai assistant for rcs project.",
    messages
  });
  console.log(result)

  return result.toDataStreamResponse();
}