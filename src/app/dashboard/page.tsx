import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, FileText, History } from 'lucide-react';

const features = [
  {
    title: 'AI Chatbot',
    description: 'Get instant explanations and discuss complex topics with your AI tutor.',
    href: '/chatbot',
    icon: <Bot className="w-8 h-8 text-primary" />,
  },
  {
    title: 'Quiz Generator',
    description: 'Create custom quizzes on any topic to test your knowledge.',
    href: '/quiz',
    icon: <FileText className="w-8 h-8 text-primary" />,
  },
  {
    title: 'Quiz History',
    description: 'Review your past quiz results and track your learning progress over time.',
    href: '/history',
    icon: <History className="w-8 h-8 text-primary" />,
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Welcome back, Student!
        </h1>
        <p className="text-muted-foreground">
          Ready for another learning session? Here's what you can do.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="flex flex-col transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center gap-4">
              {feature.icon}
              <div>
                <CardTitle className="font-headline">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
              <Link href={feature.href} className="w-full">
                <Button variant="outline" className="w-full">
                  <span>Go to {feature.title}</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
