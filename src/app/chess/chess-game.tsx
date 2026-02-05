'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAiChessMove } from './actions';

type Piece = string | null;
type Board = Piece[][];
type Square = { row: number; col: number };
type Move = { from: Square; to: Square };

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
  const [isAiThinking, setIsAiThinking] = useState(false);

  const resetGame = () => {
    setBoard(JSON.parse(JSON.stringify(initialBoard)));
    setTurn('white');
    setMessage("White's turn to move.");
    setSelectedSquare(null);
    setIsAiThinking(false);
  };

  const makeMove = (move: Move) => {
    const { from, to } = move;
    const pieceToMove = board[from.row][from.col];

    // Basic validation
    if (!pieceToMove) return;

    const newBoard = board.map(r => [...r]);
    newBoard[to.row][to.col] = pieceToMove;
    newBoard[from.row][from.col] = null;
    setBoard(newBoard);

    // Switch turn
    const newTurn = turn === 'white' ? 'black' : 'white';
    setTurn(newTurn);
    
    if (newTurn === 'white') {
        setMessage("White's turn to move.");
    } else {
        setMessage("Black's turn (AI is thinking...).");
    }
    setSelectedSquare(null);
  };
  
  useEffect(() => {
    if (turn === 'black' && !isAiThinking) {
      const fetchAiMove = async () => {
        setIsAiThinking(true);
        setMessage("Black's turn (AI is thinking...).");
        const aiMove = await getAiChessMove({ board, turn });
        
        if ('error' in aiMove) {
            setMessage(`AI Error: ${aiMove.error}. White's turn again.`);
            setTurn('white'); // Give turn back to player on error
        } else {
            const piece = board[aiMove.from.row][aiMove.from.col];
            setMessage(`AI moves ${piece}. White's turn.`);
            makeMove({ from: aiMove.from, to: aiMove.to });
        }
        setIsAiThinking(false);
      };
      // Add a small delay to make the AI's move feel more natural
      setTimeout(fetchAiMove, 1000);
    }
  }, [turn, board, isAiThinking]);

  const handleSquareClick = (row: number, col: number) => {
    // Prevent player from moving during AI's turn
    if (turn === 'black' || isAiThinking) {
        return;
    }

    const piece = board[row][col];

    if (selectedSquare) {
      // It's a destination square
      const pieceToMove = board[selectedSquare.row][selectedSquare.col];

      // Prevent moving onto one's own piece
      if (piece) {
        const isMovingPieceWhite = whitePieces.includes(pieceToMove!);
        const isDestPieceWhite = whitePieces.includes(piece);
        if (isMovingPieceWhite && isDestPieceWhite) {
          // It's a move to another of your own pieces, so select the new piece instead
          setSelectedSquare({ row, col });
          setMessage(`Selected ${piece}. Choose a destination square.`);
          return;
        }
      }
      
      makeMove({ from: selectedSquare, to: { row, col } });
      
    } else {
      // It's a source square
      if (!piece) {
        return; // Clicked on empty square
      }

      // Check if it's the correct player's turn
      const isPieceWhite = whitePieces.includes(piece);
      if ((turn === 'white' && !isPieceWhite)) {
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
        <CardTitle className="font-headline">Chess Game vs. AI</CardTitle>
        <CardDescription className="flex items-center justify-center gap-2">
            {isAiThinking && <Bot className="animate-pulse" size={16}/>}
            {message}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center p-2 sm:p-4">
        <div className={cn(
            "grid grid-cols-8 border-2 border-primary bg-background overflow-hidden rounded-md",
            isAiThinking && "opacity-50 pointer-events-none"
        )}>
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
                    isSelected ? 'ring-2 ring-inset ring-yellow-400' : 'hover:bg-primary/40',
                    turn === 'black' && 'cursor-not-allowed'
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
