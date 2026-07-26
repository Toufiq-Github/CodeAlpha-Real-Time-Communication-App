
'use server';

import { assistPost, PostAssistantInput } from "@/ai/flows/post-assistant-flow";
import { summarizeSession, SessionSummaryInput } from "@/ai/flows/session-summary-flow";

export async function getPostAssistance(input: PostAssistantInput) {
  try {
    const result = await assistPost(input);
    return { data: result, error: null };
  } catch (error: any) {
    console.error("AI Assistance error:", error);
    return { data: null, error: "Failed to get AI assistance. Please try again." };
  }
}

export async function generateRoomSummary(input: SessionSummaryInput) {
  try {
    const result = await summarizeSession(input);
    return { data: result, error: null };
  } catch (error: any) {
    console.error("AI Summary error:", error);
    return { data: null, error: "Failed to generate session summary." };
  }
}
