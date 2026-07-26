
'use server';
/**
 * @fileOverview A Genkit flow for summarizing a workspace session based on chat messages.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SessionSummaryInputSchema = z.object({
  messages: z.array(z.object({
    sender: z.string(),
    text: z.string(),
  })).describe('The list of chat messages from the session.'),
});
export type SessionSummaryInput = z.infer<typeof SessionSummaryInputSchema>;

const SessionSummaryOutputSchema = z.object({
  summary: z.string().describe('A professional 2-3 sentence summary of the session context and objectives.'),
});
export type SessionSummaryOutput = z.infer<typeof SessionSummaryOutputSchema>;

export async function summarizeSession(input: SessionSummaryInput): Promise<SessionSummaryOutput> {
  const { output } = await ai.generate({
    input,
    output: { schema: SessionSummaryOutputSchema },
    prompt: `You are a professional executive assistant. Analyze the following workspace session chat transcript and provide a concise 2-3 sentence summary of what was discussed and the objectives achieved.

    If there are no messages or very few, state that the session was initialized but had minimal activity.

    Transcript:
    {{#each messages}}
    - {{{sender}}}: {{{text}}}
    {{/each}}`
  });
  return output!;
}
