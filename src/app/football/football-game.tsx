'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { RefreshCw, Shield, SoccerBall, Trophy, Info } from 'lucide-react';

type GameState = 'playing' | 'gameOver';
type ShotDirection = 'Left' | 'Center' | 'Right';

const directions: ShotDirection[] = ['Left', 'Center', 'Right'];
const totalShots = 5;

export function FootballGame() {
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0); // Goalkeeper saves
  const [shotsTaken, setShotsTaken] = useState(0);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [lastPlayerShot, setLastPlayerShot] = useState<ShotDirection | null>(null);
  const [lastComputerDive, setLastComputerDive] = useState<ShotDirection | null>(null);
  const [message, setMessage] = useState('Take your first shot!');

  const handleShot = (shot: ShotDirection) => {
    if (gameState === 'gameOver') return;

    const computerDive = directions[Math.floor(Math.random() * directions.length)];
    
    setLastPlayerShot(shot);
    setLastComputerDive(computerDive);

    if (shot === computerDive) {
      setComputerScore(prev => prev + 1);
      setMessage(`SAVED! The keeper dived ${computerDive}.`);
    } else {
      setPlayerScore(prev => prev + 1);
      setMessage(`GOAL! You shot ${shot}, the keeper dived ${computerDive}.`);
    }

    const newShotsTaken = shotsTaken + 1;
    setShotsTaken(newShotsTaken);

    if (newShotsTaken >= totalShots) {
      setGameState('gameOver');
    }
  };

  const resetGame = () => {
    setPlayerScore(0);
    setComputerScore(0);
    setShotsTaken(0);
    setGameState('playing');
    setLastPlayerShot(null);
    setLastComputerDive(null);
    setMessage('Take your first shot!');
  };

  useEffect(() => {
    if (gameState === 'gameOver') {
      if (playerScore > (totalShots - computerScore)) {
        setMessage(`Game over! You won ${playerScore} - ${computerScore}. What a victory!`);
      } else if (playerScore < (totalShots - computerScore)) {
        setMessage(`Game over! You lost ${playerScore} - ${computerScore}. Better luck next time.`);
      } else {
        setMessage(`Game over! It's a draw, ${playerScore} - ${computerScore}. A hard-fought match!`);
      }
    }
  }, [gameState, playerScore, computerScore]);

  return (
    <Card className="w-full max-w-lg mx-auto">
        <CardHeader className="text-center">
            <CardTitle className="font-headline">Penalty Shootout</CardTitle>
            <CardDescription>You have {totalShots - shotsTaken} shots remaining.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex justify-around text-center p-6 bg-muted rounded-lg">
                <div>
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-2"><SoccerBall size={16}/> Your Goals</p>
                    <p className="text-5xl font-bold font-headline text-primary">{playerScore}</p>
                </div>
                 <div>
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-2"><Shield size={16}/> Keeper's Saves</p>
                    <p className="text-5xl font-bold font-headline text-destructive">{computerScore}</p>
                </div>
            </div>
            
            <div className="flex justify-around text-center h-16 items-center">
              {lastPlayerShot && (
                <div>
                  <p className="text-sm font-medium">You Shot</p>
                  <p className="text-2xl font-bold">{lastPlayerShot}</p>
                </div>
              )}
              {lastComputerDive && (
                <div>
                  <p className="text-sm font-medium">Keeper Dived</p>
                  <p className="text-2xl font-bold">{lastComputerDive}</p>
                </div>
              )}
            </div>

            {gameState === 'playing' ? (
              <div>
                <p className="text-center text-muted-foreground mb-4">Choose where to shoot</p>
                <div className="grid grid-cols-3 gap-4">
                    {directions.map(dir => (
                        <Button
                            key={dir}
                            onClick={() => handleShot(dir)}
                            variant="outline"
                            className="h-20 text-xl font-bold"
                        >
                            {dir}
                        </Button>
                    ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <Trophy className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="text-xl font-bold font-headline mb-2">Shootout Over!</h3>
                <p className="text-muted-foreground">Final Score: You {playerScore} - {computerScore} Keeper</p>
              </div>
            )}
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <div className="flex items-center text-sm text-muted-foreground p-3 bg-accent/50 rounded-lg min-h-[50px] w-full">
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
