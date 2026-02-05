'use server';

import { getChessMove, GetChessMoveInput, GetChessMoveOutput } from '@/ai/flows/get-chess-move';

export async function getAiChessMove(input: GetChessMoveInput): Promise<GetChessMoveOutput | { error: string }> {
  try {
    const result = await getChessMove(input);
    return result;
  } catch (error: any) {
    console.error('Error getting AI chess move:', error);
    // Try to return a more specific error message if available
    const errorMessage = error.message || 'The AI failed to determine a move. Please try again.';
    return { error: errorMessage };
  }
}
