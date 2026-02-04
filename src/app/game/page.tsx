import { GameBoard } from './game-board';

export default function GamePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Relaxing Game</h1>
        <p className="text-muted-foreground">
          A simple game to help you relax and refocus.
        </p>
      </div>
      <GameBoard />
    </div>
  );
}
