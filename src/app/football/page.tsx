import { FootballGame } from './football-game';

export default function FootballPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Football Game</h1>
        <p className="text-muted-foreground">
          A simple penalty shootout game to test your luck.
        </p>
      </div>
      <FootballGame />
    </div>
  );
}
