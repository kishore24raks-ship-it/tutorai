'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

type Piece = string | null;
type Board = Piece[][];

const initialBoard: Board = [
  ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'], // Black pieces
  ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'], // White pieces
  ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
];

const whitePieces = ['♔', '♕', '♖', '♗', '♘', '♙'];
const blackPieces = ['♚', '♛', '♜', '♝', '♞', '♟'];

export function ChessGame() {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [turn, setTurn] = useState<'white' | 'black'>('white');
  const [message, setMessage] = useState("White's turn to move.");

  const resetGame = () => {
    setBoard(initialBoard);
    setTurn('white');
    setMessage("White's turn to move.");
  };
  
  // This is a placeholder. Full game logic is very complex.
  const handleSquareClick = (row: number, col: number) => {
    // For now, it doesn't do anything.
    setMessage("This is a static board for now. Interactive gameplay is not yet implemented.");
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="font-headline">Chess Game</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center p-2 sm:p-4">
        <div className="grid grid-cols-8 border-2 border-primary bg-background overflow-hidden rounded-md">
          {board.map((row, rowIndex) =>
            row.map((piece, colIndex) => {
              const isLightSquare = (rowIndex + colIndex) % 2 === 0;
              const isWhitePiece = whitePieces.includes(piece || '');
              const isBlackPiece = blackPieces.includes(piece || '');

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                  className={cn(
                    'w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-4xl cursor-pointer transition-colors',
                    isLightSquare ? 'bg-accent/50' : 'bg-primary/20',
                    'hover:bg-primary/40'
                  )}
                >
                  <span className={cn(
                      'transition-transform hover:scale-110',
                      isWhitePiece && 'text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]',
                      isBlackPiece && 'text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]'
                  )}>
                    {piece}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={resetGame} className="mx-auto">
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset Board
        </Button>
      </CardFooter>
    </Card>
  );
}
