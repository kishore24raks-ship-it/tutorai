'use server';

/**
 * @fileOverview An AI agent that explains a concept to a student using a chatbot interface.
 *
 * - explainConcept - A function that handles the explanation process.
 * - ExplainConceptInput - The input type for the explainConcept function.
 * - ExplainConceptOutput - The return type for the explainConcept function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainConceptInputSchema = z.object({
  concept: z.string().describe('The concept to be explained.'),
  studentLevel: z
    .string()
    .describe(
      'The student level, e.g. high school, undergraduate, graduate. This helps tailor the explanation.'
    ),
  previousContext: z.string().optional().describe('The previous context of the conversation, if any.'),
});
export type ExplainConceptInput = z.infer<typeof ExplainConceptInputSchema>;

const ExplainConceptOutputSchema = z.object({
  explanation: z.string().describe('The explanation of the concept.'),
});
export type ExplainConceptOutput = z.infer<typeof ExplainConceptOutputSchema>;

export async function explainConcept(input: ExplainConceptInput): Promise<ExplainConceptOutput> {
  return explainConceptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainConceptPrompt',
  input: {schema: ExplainConceptInputSchema},
  output: {schema: ExplainConceptOutputSchema},
  prompt: `You are a helpful tutor that explains concepts to students.

  The student is at a {{{studentLevel}}} level.

  Explain the concept of {{{concept}}}. Try to explain it in simple terms.

  Include any previous context that was provided: {{{previousContext}}}
  `,
});

const explainConceptFlow = ai.defineFlow(
  {
    name: 'explainConceptFlow',
    inputSchema: ExplainConceptInputSchema,
    outputSchema: ExplainConceptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
