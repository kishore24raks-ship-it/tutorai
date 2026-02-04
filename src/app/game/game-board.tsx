'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import {
  Apple,
  Banana,
  Brain,
  Cloud,
  Heart,
  Moon,
  Rocket,
  Star,
  RefreshCw,
  Award,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const icons = [
  { name: 'Apple', component: Apple },
  { name: 'Banana', component: Banana },
  { name: 'Brain', component: Brain },
  { name: 'Cloud', component: Cloud },
  { name: 'Heart', component: Heart },
  { name: 'Moon', component: Moon },
  { name: 'Rocket', component: Rocket },
  { name: 'Star', component: Star },
];

const createShuffledCards = () => {
  const cardPairs = [...icons, ...icons];
  return cardPairs
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }, index) => ({
      id: index,
      icon: value.component,
      name: value.name,
      isFlipped: false,
      isMatched: false,
    }));
};

type CardType = ReturnType<typeof createShuffledCards>[0];

export function GameBoard() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const initGame = () => {
    setCards(createShuffledCards());
    setFlippedCards([]);
    setIsChecking(false);
    setMoves(0);
    setIsComplete(false);
  };

  useEffect(() => {
    initGame();
  }, []);
  
  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.isMatched)) {
      setTimeout(() => setIsComplete(true), 500);
    }
  }, [cards]);

  const handleCardClick = (id: number) => {
    const clickedCard = cards.find(c => c.id === id);
    if (isChecking || flippedCards.length >= 2 || clickedCard?.isFlipped) {
      return;
    }

    const newCards = cards.map(card =>
      card.id === id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);

    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      setIsChecking(true);
      const [firstCardId, secondCardId] = newFlippedCards;
      const firstCard = newCards.find(c => c.id === firstCardId);
      const secondCard = newCards.find(c => c.id === secondCardId);

      if (firstCard?.name === secondCard?.name) {
        // Match
        setTimeout(() => {
          setCards(prevCards => prevCards.map(card =>
            card.name === firstCard.name ? { ...card, isMatched: true, isFlipped: true } : card
          ));
          setFlippedCards([]);
          setIsChecking(false);
        }, 800);
      } else {
        // No match
        setTimeout(() => {
          setCards(prevCards => prevCards.map(card =>
            !card.isMatched ? { ...card, isFlipped: false } : card
          ));
          setFlippedCards([]);
          setIsChecking(false);
        }, 1200);
      }
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="font-headline">Memory Match</CardTitle>
            <div className="flex items-center gap-4 text-muted-foreground">
                <span>Moves: {moves}</span>
                <Button onClick={initGame} variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset
                </Button>
            </div>
        </CardHeader>
        <CardContent>
            {isComplete ? (
                <div className="text-center py-10">
                    <Award className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h2 className="text-2xl font-bold font-headline mb-2">Congratulations!</h2>
                    <p className="text-muted-foreground">You completed the game in {moves} moves.</p>
                    <Button onClick={initGame} className="mt-6">Play Again</Button>
                </div>
            ) : (
                <div className="grid grid-cols-4 gap-4">
                    {cards.map(card => {
                        const CardIcon = card.icon;
                        return (
                            <Card 
                                key={card.id} 
                                onClick={() => handleCardClick(card.id)}
                                className={cn(
                                    "h-24 flex items-center justify-center cursor-pointer transition-colors duration-300",
                                    card.isFlipped ? "bg-accent border-primary" : "bg-muted hover:bg-muted/80",
                                    card.isMatched && "border-primary",
                                    isChecking && flippedCards.includes(card.id) && !card.isMatched && "border-destructive"
                                )}
                            >
                                {card.isFlipped ? <CardIcon className="w-10 h-10 text-primary" /> : <HelpCircle className="w-10 h-10 text-muted-foreground/50"/>}
                            </Card>
                        )
                    })}
                </div>
            )}
        </CardContent>
    </Card>
  );
}
