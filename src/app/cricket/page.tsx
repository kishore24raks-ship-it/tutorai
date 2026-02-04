import { CricketGame } from './cricket-game';

export default function CricketPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Cricket Game</h1>
        <p className="text-muted-foreground">
          A simple cricket batting game to test your luck.
        </p>
      </div>
      <CricketGame />
    </div>
  );
}
