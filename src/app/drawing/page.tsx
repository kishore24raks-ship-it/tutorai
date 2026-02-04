import { DrawingCanvas } from './drawing-canvas';

export default function DrawingPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Drawing Tool</h1>
        <p className="text-muted-foreground">
          A simple drawing pad to sketch your ideas.
        </p>
      </div>
      <DrawingCanvas />
    </div>
  );
}
