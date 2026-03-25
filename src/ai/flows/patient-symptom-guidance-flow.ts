'use server';
/**
 * @fileOverview A Genkit flow for providing preliminary guidance and potential conditions
 * based on patient-described eye-related symptoms.
 *
 * - patientSymptomGuidance - A function that handles the symptom analysis process.
 * - PatientSymptomGuidanceInput - The input type for the patientSymptomGuidance function.
 * - PatientSymptomGuidanceOutput - The return type for the patientSymptomGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PatientSymptomGuidanceInputSchema = z.object({
  symptoms: z
    .string()
    .describe(
      'A detailed description of the patient\'s eye-related symptoms.'
    ),
});
export type PatientSymptomGuidanceInput = z.infer<
  typeof PatientSymptomGuidanceInputSchema
>;

const PatientSymptomGuidanceOutputSchema = z.object({
  preliminaryGuidance: z
    .string()
    .describe('General advice and next steps based on the symptoms.'),
  potentialConditions: z
    .array(z.string())
    .describe('A list of potential eye-related conditions (not a diagnosis).'),
  disclaimer: z
    .string()
    .describe(
      'A clear disclaimer stating that this is not a medical diagnosis.'
    ),
});
export type PatientSymptomGuidanceOutput = z.infer<
  typeof PatientSymptomGuidanceOutputSchema
>;

export async function patientSymptomGuidance(
  input: PatientSymptomGuidanceInput
): Promise<PatientSymptomGuidanceOutput> {
  return patientSymptomGuidanceFlow(input);
}

const patientSymptomGuidancePrompt = ai.definePrompt({
  name: 'patientSymptomGuidancePrompt',
  input: {schema: PatientSymptomGuidanceInputSchema},
  output: {schema: PatientSymptomGuidanceOutputSchema},
  prompt: `You are an AI Symptom Analysis Tool for eye-related issues. Your purpose is to provide preliminary guidance and information about potential conditions based on a patient's symptoms, without offering a diagnosis. Be helpful, informative, and always emphasize that this is not a substitute for professional medical advice.

Based on the following eye-related symptoms described by the patient, provide:
1.  **Preliminary Guidance**: General advice, comfort measures, or recommended next steps.
2.  **Potential Conditions**: A list of common or relevant eye conditions that *could* be associated with these symptoms. Ensure to state these are possibilities, not definitive diagnoses.
3.  **Disclaimer**: A strong statement reinforcing that this is AI guidance and not a medical diagnosis, and the patient should consult a doctor.

Patient's Symptoms: {{{symptoms}}}`,
});

const patientSymptomGuidanceFlow = ai.defineFlow(
  {
    name: 'patientSymptomGuidanceFlow',
    inputSchema: PatientSymptomGuidanceInputSchema,
    outputSchema: PatientSymptomGuidanceOutputSchema,
  },
  async (input) => {
    const {output} = await patientSymptomGuidancePrompt(input);
    return output!;
  }
);
