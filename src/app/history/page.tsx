'use client';

import { collection, query, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { QuizResult } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const getBadgeVariant = (difficulty: string) => {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-100 text-green-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'hard':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function HistoryPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const historyQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(firestore, 'users', user.uid, 'quiz_results'),
      orderBy('completionDate', 'desc')
    );
  }, [user, firestore]);

  const { data: history, isLoading } = useCollection<QuizResult>(historyQuery);
  
  const renderLoading = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><Skeleton className="h-5 w-20" /></TableHead>
              <TableHead><Skeleton className="h-5 w-20" /></TableHead>
              <TableHead><Skeleton className="h-5 w-20" /></TableHead>
              <TableHead className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(3)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-5 w-24 ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const renderEmptyState = () => (
    <Card className="text-center py-12">
      <CardHeader>
        <CardTitle>No History Yet</CardTitle>
        <CardDescription>You haven't completed any quizzes. Take a quiz to start building your history!</CardDescription>
      </CardHeader>
    </Card>
  );
  
  if (isUserLoading || (user && isLoading)) {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Quiz History</h1>
          <p className="text-muted-foreground">
            Review your past performance and see how much you've grown.
          </p>
        </div>
        {renderLoading()}
      </div>
    )
  }

  if (!user) {
     return (
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Quiz History</h1>
          <p className="text-muted-foreground">
            Review your past performance and see how much you've grown.
          </p>
        </div>
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle>Please Log In</CardTitle>
            <CardDescription>You need to be logged in to view your quiz history.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Quiz History</h1>
        <p className="text-muted-foreground">
          Review your past performance and see how much you've grown.
        </p>
      </div>

      {history && history.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Past Quizzes</CardTitle>
            <CardDescription>A list of all the quizzes you have completed.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Topic</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell className="font-medium">{quiz.topic}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('capitalize border-none', getBadgeVariant(quiz.difficulty))}>
                        {quiz.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>{quiz.score}/{quiz.totalQuestions} ({Math.round((quiz.score / quiz.totalQuestions) * 100)}%)</TableCell>
                    <TableCell className="text-right">{format(new Date(quiz.completionDate), 'yyyy-MM-dd')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : renderEmptyState()}
    </div>
  );
}
