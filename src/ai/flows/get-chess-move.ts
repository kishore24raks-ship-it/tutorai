'use server';
/**
 * @fileOverview A chess AI agent that determines the next move.
 *
 * - getChessMove - A function that handles getting the AI's next chess move.
 * - GetChessMoveInput - The input type for the getChessMove function.
 * - GetChessMoveOutput - The return type for the getChessMove function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetChessMoveInputSchema = z.object({
  board: z.array(z.array(z.string().nullable())).describe("The current 8x8 chess board state. Uses standard Unicode chess piece notation (e.g., ♜ for black rook, ♖ for white rook). Empty squares are null."),
  turn: z.enum(['white', 'black']).describe("The current player to move. The AI will play as black."),
});
export type GetChessMoveInput = z.infer<typeof GetChessMoveInputSchema>;

const GetChessMoveOutputSchema = z.object({
  from: z.object({
    row: z.number().min(0).max(7).describe('The starting row of the piece to move (0-7).'),
    col: z.number().min(0).max(7).describe('The starting column of the piece to move (0-7).'),
  }),
  to: z.object({
    row: z.number().min(0).max(7).describe('The destination row for the piece (0-7).'),
    col: z.number().min(0).max(7).describe('The destination column for the piece (0-7).'),
  }),
  moveDescription: z.string().describe('A brief description of the move in algebraic notation, e.g., "e7e5".'),
});
export type GetChessMoveOutput = z.infer<typeof GetChessMoveOutputSchema>;


function formatBoardForPrompt(board: (string | null)[][]): string {
    return `  a b c d e f g h\n` + board.map((row, rowIndex) => 
        (8 - rowIndex) + ' ' + row.map(piece => piece || '.').join(' ')
    ).join('\n');
}

export async function getChessMove(input: GetChessMoveInput): Promise<GetChessMoveOutput> {
  // Add the formatted board string to the input for the prompt.
  const extendedInput = {
      ...input,
      boardString: formatBoardForPrompt(input.board),
  };
  return getChessMoveFlow(extendedInput);
}

const getChessMovePrompt = ai.definePrompt({
  name: 'getChessMovePrompt',
  input: {
      schema: GetChessMoveInputSchema.extend({
          boardString: z.string(),
      })
  },
  output: {schema: GetChessMoveOutputSchema},
  prompt: `You are a chess engine. You are playing as the black pieces. 
The current board state is provided below, with row 8 at the top (black's side) and row 1 at the bottom (white's side).

Your pieces are: ♜ (rook), ♞ (knight), ♝ (bishop), ♛ (queen), ♚ (king), ♟ (pawn).
White's pieces are: ♖ (rook), ♘ (knight), ♗ (bishop), ♕ (queen), ♔ (king), ♙ (pawn).

Current Board:
\`\`\`
{{{boardString}}}
\`\`\`

It is black's turn to move. Analyze the board and determine the best possible move. 

Your move must be a valid move for a black piece. 
- You can only move a black piece.
- The destination square can be empty ('.') or contain a white piece.
- You cannot move to a square already occupied by another black piece.
- Be strategic. Try to control the center, develop your pieces, and protect your king.

Return your move in the specified JSON format.
`,
});

const getChessMoveFlow = ai.defineFlow(
  {
    name: 'getChessMoveFlow',
    inputSchema: GetChessMoveInputSchema.extend({
        boardString: z.string(),
    }),
    outputSchema: GetChessMoveOutputSchema,
  },
  async input => {
    const {output} = await getChessMovePrompt(input);
    return output!;
  }
);
