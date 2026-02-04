'use server';

import { explainConcept, ExplainConceptInput } from '@/ai/flows/explain-concept-with-chatbot';

export async function getExplanation(input: ExplainConceptInput) {
  try {
    const result = await explainConcept(input);
    return result;
  } catch (error) {
    console.error('Error getting explanation:', error);
    return { explanation: 'Sorry, I encountered an error. Please try again.' };
  }
}
