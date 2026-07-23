
'use server';

import { assistPost, PostAssistantInput } from "@/ai/flows/post-assistant-flow";

export async function getPostAssistance(input: PostAssistantInput) {
  try {
    const result = await assistPost(input);
    return { data: result, error: null };
  } catch (error: any) {
    console.error("AI Assistance error:", error);
    return { data: null, error: "Failed to get AI assistance. Please try again." };
  }
}
