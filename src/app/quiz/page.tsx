import { QuizFlow } from './quiz-flow';

export default function QuizPage() {
  return (
    <div className="flex flex-col items-center">
       <div className="w-full max-w-3xl mb-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Quiz Generator</h1>
        <p className="text-muted-foreground">
          Test your knowledge by generating a custom quiz on any topic.
        </p>
      </div>
      <QuizFlow />
    </div>
  );
}
