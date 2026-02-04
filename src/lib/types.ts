export type QuizQuestion = {
  question: string;
  answers: string[];
  correctAnswer: string;
};

export type Quiz = {
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  numQuestions: number;
  quiz: QuizQuestion[];
};

export type UserAnswer = {
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
};

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}
