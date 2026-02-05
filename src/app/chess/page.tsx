import { ChessGame } from './chess-game';

export default function ChessPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Chess Game</h1>
        <p className="text-muted-foreground">
          A classic strategy game to challenge your mind.
        </p>
      </div>
      <ChessGame />
    </div>
  );
}
