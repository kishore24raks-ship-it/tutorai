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

const mockHistory = [
  {
    topic: 'Photosynthesis',
    difficulty: 'easy',
    score: '5/5',
    percentage: 100,
    date: '2023-10-27',
  },
  {
    topic: 'The Roman Empire',
    difficulty: 'medium',
    score: '7/10',
    percentage: 70,
    date: '2023-10-25',
  },
  {
    topic: 'JavaScript Promises',
    difficulty: 'hard',
    score: '3/5',
    percentage: 60,
    date: '2023-10-24',
  },
  {
    topic: 'World War II',
    difficulty: 'medium',
    score: '9/10',
    percentage: 90,
    date: '2023-10-22',
  },
  {
    topic: 'Basic Algebra',
    difficulty: 'easy',
    score: '4/5',
    percentage: 80,
    date: '2023-10-20',
  },
];

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
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Quiz History</h1>
        <p className="text-muted-foreground">
          Review your past performance and see how much you've grown.
        </p>
      </div>

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
              {mockHistory.map((quiz, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{quiz.topic}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn('capitalize border-none', getBadgeVariant(quiz.difficulty))}>
                      {quiz.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>{quiz.score} ({quiz.percentage}%)</TableCell>
                  <TableCell className="text-right">{quiz.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
