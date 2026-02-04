'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, ArrowRight, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { createQuiz } from './actions';
import { quizFormSchema } from './schema';
import type { Quiz, UserAnswer, QuizQuestion } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type View = 'form' | 'loading' | 'taking' | 'results';

export function QuizFlow() {
  const [view, setView] = useState<View>('form');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [score, setScore] = useState(0);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof quizFormSchema>>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      topic: '',
      numQuestions: 5,
      difficulty: 'easy',
    },
  });

  async function onSubmit(values: z.infer<typeof quizFormSchema>) {
    setView('loading');
    const result = await createQuiz(values);
    if ('error' in result) {
      toast({
        variant: 'destructive',
        title: 'Quiz Generation Failed',
        description: result.error,
      });
      setView('form');
    } else {
      setQuiz(result);
      setView('taking');
    }
  }

  function handleAnswerSelect(questionIndex: number, answer: string) {
    setSelectedAnswers(prev => ({ ...prev, [questionIndex]: answer }));
  }

  function handleNextQuestion() {
    if (currentQuestionIndex < (quiz?.quiz.length ?? 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  }

  function finishQuiz() {
    if (!quiz) return;
    let correctCount = 0;
    const answered = quiz.quiz.map((q, i) => {
      const userAnswer = selectedAnswers[i];
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) correctCount++;
      return {
        question: q.question,
        selectedAnswer: userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect: isCorrect,
      };
    });

    setUserAnswers(answered);
    setScore(correctCount);
    setView('results');
  }

  function resetQuiz() {
    setView('form');
    setQuiz(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setUserAnswers([]);
    setScore(0);
    form.reset();
  }

  if (view === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h2 className="text-2xl font-semibold font-headline">Generating Your Quiz...</h2>
        <p className="text-muted-foreground">Our AI is crafting the perfect questions for you. Please wait a moment.</p>
      </div>
    );
  }

  if (view === 'taking' && quiz) {
    const currentQuestion: QuizQuestion = quiz.quiz[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quiz.quiz.length) * 100;
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <Progress value={progress} className="mb-2" />
          <CardTitle className="font-headline text-2xl">{quiz.topic} Quiz</CardTitle>
          <CardDescription>Question {currentQuestionIndex + 1} of {quiz.quiz.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-semibold text-lg mb-6">{currentQuestion.question}</p>
          <RadioGroup 
            onValueChange={(value) => handleAnswerSelect(currentQuestionIndex, value)}
            value={selectedAnswers[currentQuestionIndex]}
            className="space-y-4"
          >
            {currentQuestion.answers.map((answer, i) => (
              <div key={i} className="flex items-center space-x-3">
                <RadioGroupItem value={answer} id={`q${currentQuestionIndex}-a${i}`} />
                <Label htmlFor={`q${currentQuestionIndex}-a${i}`} className="text-base font-normal">{answer}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter>
          <Button onClick={handleNextQuestion} disabled={!selectedAnswers[currentQuestionIndex]} className="ml-auto">
            {currentQuestionIndex < quiz.quiz.length - 1 ? 'Next Question' : 'Finish Quiz'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (view === 'results') {
    const percentage = quiz ? Math.round((score / quiz.quiz.length) * 100) : 0;
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-3xl font-headline">Quiz Complete!</CardTitle>
            <CardDescription>Here are your results for the {quiz?.topic} quiz.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold text-primary">{percentage}%</p>
            <p className="text-lg text-muted-foreground">You answered {score} out of {quiz?.quiz.length} questions correctly.</p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button onClick={resetQuiz}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Take Another Quiz
            </Button>
          </CardFooter>
        </Card>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold font-headline">Review Your Answers</h3>
          {userAnswers.map((answer, index) => (
            <Card key={index} className={cn(answer.isCorrect ? 'border-green-500' : 'border-red-500')}>
              <CardContent className="p-4">
                <p className="font-semibold mb-2">{index + 1}. {answer.question}</p>
                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground">Your answer: <span className={cn(answer.isCorrect ? 'text-green-700' : 'text-red-700')}>{answer.selectedAnswer || 'Not answered'}</span></p>
                  {!answer.isCorrect && <p className="text-muted-foreground">Correct answer: <span className="text-green-700">{answer.correctAnswer}</span></p>}
                </div>
                {answer.isCorrect ? <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-green-500"/> : <XCircle className="absolute top-2 right-2 h-5 w-5 text-red-500"/>}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="font-headline">Create a New Quiz</CardTitle>
        <CardDescription>Tell our AI what you want to be quizzed on, and it will generate it for you.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., The American Revolution" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numQuestions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Questions</FormLabel>
                  <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={String(field.value)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select number of questions" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[3, 5, 10].map(num => <SelectItem key={num} value={String(num)}>{num} Questions</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Generate Quiz</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
