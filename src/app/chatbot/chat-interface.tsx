'use client';

import { useState, useRef, useEffect } from 'react';
import type { FormEvent } from 'react';
import { SendHorizonal, Bot, User, CornerDownLeft, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getExplanation } from './actions';
import type { Message } from '@/lib/types';
import { cn } from '@/lib/utils';

const studentLevels = ['High School', 'Undergraduate', 'Graduate', 'Curious Learner'];

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [concept, setConcept] = useState('');
  const [studentLevel, setStudentLevel] = useState('Curious Learner');
  const [isConceptSet, setIsConceptSet] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleConceptSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (concept.trim() && studentLevel.trim()) {
      setIsConceptSet(true);
      setMessages([{
        id: Date.now().toString(),
        role: 'assistant',
        content: `Great! Let's talk about **${concept}**. Feel free to ask me anything.`
      }]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const previousContext = messages
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join('\n');
        
      const response = await getExplanation({
        concept: concept,
        studentLevel: studentLevel,
        previousContext: `${previousContext}\nuser: ${input}`,
      });
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.explanation,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConceptSet) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline">Start a new conversation</CardTitle>
          <CardDescription>First, tell me what concept you want to learn about and your current level.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleConceptSubmit} className="space-y-4">
            <div>
              <label htmlFor="concept" className="block text-sm font-medium text-gray-700">Concept or Topic</label>
              <Textarea
                id="concept"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="e.g., Photosynthesis, React Hooks, The Cold War"
                required
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="studentLevel" className="block text-sm font-medium text-gray-700">I am a...</label>
              <select
                id="studentLevel"
                value={studentLevel}
                onChange={(e) => setStudentLevel(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              >
                {studentLevels.map(level => <option key={level}>{level}</option>)}
              </select>
            </div>
            <Button type="submit" className="w-full">Start Learning</Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] bg-card rounded-xl shadow-md">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="p-4 sm:p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex items-start gap-4',
                  message.role === 'user' ? 'justify-end' : ''
                )}
              >
                {message.role === 'assistant' && (
                  <Avatar className="w-8 h-8 border">
                    <AvatarFallback><Bot size={16} /></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-md p-3 rounded-lg prose prose-sm',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  {/* Basic markdown support */}
                  {message.content.split('**').map((part, index) =>
                    index % 2 === 1 ? <strong key={index}>{part}</strong> : part
                  )}
                </div>
                {message.role === 'user' && (
                  <Avatar className="w-8 h-8 border">
                     <AvatarFallback><User size={16} /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-4">
                <Avatar className="w-8 h-8 border">
                  <AvatarFallback><Bot size={16} /></AvatarFallback>
                </Avatar>
                <div className="max-w-md p-3 rounded-lg bg-muted flex items-center">
                  <Loader2 className="animate-spin h-5 w-5 text-primary" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      <div className="p-4 border-t bg-card rounded-b-xl">
        <form onSubmit={handleSubmit} className="relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a follow-up question..."
            className="pr-16 resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute top-1/2 right-3 -translate-y-1/2"
            disabled={isLoading || !input.trim()}
          >
            <SendHorizonal size={20} />
          </Button>
        </form>
         <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <CornerDownLeft size={12}/> Shift+Enter for new line.
        </p>
      </div>
    </div>
  );
}
