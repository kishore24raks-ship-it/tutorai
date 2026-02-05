'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

type Piece = string | null;
type Board = Piece[][];
type Square = { row: number; col: number };

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
  const [board, setBoard] = useState<Board>(JSON.parse(JSON.stringify(initialBoard)));
  const [turn, setTurn] = useState<'white' | 'black'>('white');
  const [message, setMessage] = useState("White's turn to move.");
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);

  const resetGame = () => {
    setBoard(JSON.parse(JSON.stringify(initialBoard)));
    setTurn('white');
    setMessage("White's turn to move.");
    setSelectedSquare(null);
  };
  
  const handleSquareClick = (row: number, col: number) => {
    const piece = board[row][col];

    if (selectedSquare) {
      // It's a destination square
      const pieceToMove = board[selectedSquare.row][selectedSquare.col];

      // Prevent moving onto one's own piece
      if (piece) {
        const isMovingPieceWhite = whitePieces.includes(pieceToMove!);
        const isDestPieceWhite = whitePieces.includes(piece);
        if (isMovingPieceWhite === isDestPieceWhite) {
          // It's a move to another of your own pieces, so select the new piece instead
          setSelectedSquare({ row, col });
          setMessage(`Selected ${piece}. Choose a destination square.`);
          return;
        }
      }
      
      // Move the piece
      const newBoard = board.map(r => [...r]);
      newBoard[row][col] = pieceToMove;
      newBoard[selectedSquare.row][selectedSquare.col] = null;
      setBoard(newBoard);

      // Switch turn
      const newTurn = turn === 'white' ? 'black' : 'white';
      setTurn(newTurn);
      setMessage(`${newTurn.charAt(0).toUpperCase() + newTurn.slice(1)}'s turn to move.`);
      setSelectedSquare(null);
      
    } else {
      // It's a source square
      if (!piece) {
        return; // Clicked on empty square
      }

      // Check if it's the correct player's turn
      const isPieceWhite = whitePieces.includes(piece);
      if ((turn === 'white' && !isPieceWhite) || (turn === 'black' && isPieceWhite)) {
        setMessage(`It's ${turn}'s turn to move.`);
        return;
      }
      
      // Select the piece
      setSelectedSquare({ row, col });
      setMessage(`Selected ${piece}. Choose a destination square.`);
    }
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
              const isSelected = selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex;

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                  className={cn(
                    'w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-4xl cursor-pointer transition-colors',
                    isLightSquare ? 'bg-accent/50' : 'bg-primary/20',
                    isSelected ? 'ring-2 ring-inset ring-yellow-400' : 'hover:bg-primary/40'
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
