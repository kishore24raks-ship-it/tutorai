'use server';
/**
 * @fileOverview Quiz generation flow based on a topic.
 *
 * - generateQuizFromTopic - A function that generates a quiz based on a topic.
 * - GenerateQuizFromTopicInput - The input type for the generateQuizFromTopic function.
 * - GenerateQuizFromTopicOutput - The return type for the generateQuizFromTopic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizFromTopicInputSchema = z.object({
  topic: z.string().describe('The topic of the quiz.'),
  numQuestions: z.number().describe('The number of questions in the quiz.'),
  difficulty: z.enum(['easy', 'medium', 'hard']).describe('The difficulty level of the quiz.'),
});
export type GenerateQuizFromTopicInput = z.infer<typeof GenerateQuizFromTopicInputSchema>;

const GenerateQuizFromTopicOutputSchema = z.object({
  quiz: z.array(
    z.object({
      question: z.string().describe('The quiz question.'),
      answers: z.array(z.string()).describe('The possible answers to the question.'),
      correctAnswer: z.string().describe('The correct answer to the question.'),
    })
  ).describe('The generated quiz questions and answers.'),
});
export type GenerateQuizFromTopicOutput = z.infer<typeof GenerateQuizFromTopicOutputSchema>;

export async function generateQuizFromTopic(input: GenerateQuizFromTopicInput): Promise<GenerateQuizFromTopicOutput> {
  return generateQuizFromTopicFlow(input);
}

const generateQuizFromTopicPrompt = ai.definePrompt({
  name: 'generateQuizFromTopicPrompt',
  input: {schema: GenerateQuizFromTopicInputSchema},
  output: {schema: GenerateQuizFromTopicOutputSchema},
  prompt: `You are a quiz generator. Generate a quiz with the following parameters:

Topic: {{{topic}}}
Number of Questions: {{{numQuestions}}}
Difficulty: {{{difficulty}}}

The quiz should be returned in the following JSON format:
{
  "quiz": [
    {
      "question": "Question 1",
      "answers": ["Answer 1", "Answer 2", "Answer 3", "Answer 4"],
      "correctAnswer": "Answer 1"
    },
    {
      "question": "Question 2",
      "answers": ["Answer A", "Answer B", "Answer C", "Answer D"],
      "correctAnswer": "Answer B"
    }
  ]
}
`,
});

const generateQuizFromTopicFlow = ai.defineFlow(
  {
    name: 'generateQuizFromTopicFlow',
    inputSchema: GenerateQuizFromTopicInputSchema,
    outputSchema: GenerateQuizFromTopicOutputSchema,
  },
  async input => {
    const {output} = await generateQuizFromTopicPrompt(input);
    return output!;
  }
);
