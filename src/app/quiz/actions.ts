'use server';

import { z } from 'zod';
import { generateQuizFromTopic, GenerateQuizFromTopicInput } from '@/ai/flows/generate-quiz-from-topic';
import type { Quiz } from '@/lib/types';

export const quizFormSchema = z.object({
  topic: z.string().min(3, {
    message: 'Topic must be at least 3 characters.',
  }),
  numQuestions: z.coerce.number().min(1).max(10),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});

export async function createQuiz(values: GenerateQuizFromTopicInput): Promise<Quiz | { error: string }> {
  try {
    const parsedValues = quizFormSchema.parse(values);
    const quizData = await generateQuizFromTopic(parsedValues);

    if (!quizData || !quizData.quiz || quizData.quiz.length === 0) {
      return { error: 'Failed to generate quiz. The AI model did not return any questions. Please try a different topic.' };
    }

    return { ...parsedValues, ...quizData };
  } catch (error) {
    console.error('Error generating quiz:', error);
    return { error: 'An unexpected error occurred while generating the quiz. Please try again.' };
  }
}
