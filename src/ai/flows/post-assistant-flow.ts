
'use server';
/**
 * @fileOverview AI Post Assistant to help users refine their social media posts.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PostAssistantInputSchema = z.object({
  draft: z.string().describe('The user\'s current draft of the social media post.'),
});
export type PostAssistantInput = z.infer<typeof PostAssistantInputSchema>;

const PostAssistantOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('List of 3 alternative versions of the post (e.g., more professional, more exciting, shorter).'),
  hashtags: z.array(z.string()).describe('Recommended hashtags for the post.'),
  toneFeedback: z.string().describe('A brief analysis of the draft\'s tone.'),
});
export type PostAssistantOutput = z.infer<typeof PostAssistantOutputSchema>;

export async function assistPost(input: PostAssistantInput): Promise<PostAssistantOutput> {
  const { output } = await ai.generate({
    input,
    output: { schema: PostAssistantOutputSchema },
    prompt: `You are a social media growth expert. Analyze the following draft and provide 3 variations: 
    1. A more engaging/exciting version.
    2. A more professional/polished version.
    3. A short/snappy version.
    
    Also provide 5 relevant hashtags and brief tone feedback.
    
    Draft: {{{draft}}}`,
  });
  return output!;
}
