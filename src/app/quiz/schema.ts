import { z } from 'zod';

export const quizFormSchema = z.object({
  topic: z.string().min(3, {
    message: 'Topic must be at least 3 characters.',
  }),
  numQuestions: z.coerce.number().min(1).max(10),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});
