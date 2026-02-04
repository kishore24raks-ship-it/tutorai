export type QuizQuestion = {
  question: string;
  answers: string[];
  correctAnswer: string;
};

export type Quiz = {
  id?: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  numQuestions: number;
  questions: QuizQuestion[];
};

export type UserAnswer = {
  question: string;
  selectedAnswer: string | undefined;
  correctAnswer: string;
  isCorrect: boolean;
};

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export type QuizResult = {
  id: string;
  quizId: string;
  userProfileId: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  score: number;
  totalQuestions: number;
  completionDate: string;
  userAnswers: UserAnswer[];
};
