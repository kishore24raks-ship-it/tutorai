'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { RefreshCw, Award, Info } from 'lucide-react';

type GameState = 'playing' | 'gameOver';

export function CricketGame() {
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [playerChoice, setPlayerChoice] = useState<number | null>(null);
  const [computerChoice, setComputerChoice] = useState<number | null>(null);
  const [message, setMessage] = useState('Select a run to start batting!');

  const runs = [1, 2, 3, 4, 5, 6];

  const handlePlay = (run: number) => {
    const computersRun = runs[Math.floor(Math.random() * runs.length)];
    
    setPlayerChoice(run);
    setComputerChoice(computersRun);

    if (run === computersRun) {
      setMessage(`OUT! Your final score is ${score}.`);
      setGameState('gameOver');
    } else {
      const newScore = score + run;
      setScore(newScore);
      setMessage(`You scored ${run} run(s). Your total score is ${newScore}.`);
    }
  };

  const resetGame = () => {
    setScore(0);
    setPlayerChoice(null);
    setComputerChoice(null);
    setGameState('playing');
    setMessage('Select a run to start batting!');
  };

  useEffect(() => {
    resetGame();
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
            <CardTitle className="font-headline">Hand Cricket</CardTitle>
            <CardDescription>Try to score as many runs as you can!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="text-center p-6 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Your Score</p>
                <p className="text-6xl font-bold font-headline text-primary">{score}</p>
            </div>
            
            <div className="flex justify-around text-center h-16 items-center">
              {playerChoice !== null && (
                <div>
                  <p className="text-sm font-medium">You Chose</p>
                  <p className="text-2xl font-bold">{playerChoice}</p>
                </div>
              )}
              {computerChoice !== null && (
                <div>
                  <p className="text-sm font-medium">Bowler Chose</p>
                  <p className="text-2xl font-bold">{computerChoice}</p>
                </div>
              )}
            </div>

            {gameState === 'playing' ? (
              <div>
                <p className="text-center text-muted-foreground mb-4">Choose your shot (1-6 runs)</p>
                <div className="grid grid-cols-3 gap-4">
                    {runs.map(run => (
                        <Button
                            key={run}
                            onClick={() => handlePlay(run)}
                            variant="outline"
                            className="h-20 text-3xl font-bold"
                        >
                            {run}
                        </Button>
                    ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <Award className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="text-xl font-bold font-headline mb-2">Game Over!</h3>
                <p className="text-muted-foreground">Your final score is {score}.</p>
              </div>
            )}
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <div className="flex items-center text-sm text-muted-foreground p-3 bg-accent/50 rounded-lg min-h-[50px]">
            <Info className="w-4 h-4 mr-2 shrink-0"/>
            <p>{message}</p>
          </div>
          {gameState === 'gameOver' && (
             <Button onClick={resetGame} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Play Again
            </Button>
          )}
        </CardFooter>
    </Card>
  );
}
