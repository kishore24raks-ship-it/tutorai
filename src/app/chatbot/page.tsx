import { ChatInterface } from './chat-interface';

export default function ChatbotPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">AI Chatbot</h1>
        <p className="text-muted-foreground">
          Your personal AI tutor. Ask anything, and get clear explanations.
        </p>
      </div>
      <ChatInterface />
    </div>
  );
}
