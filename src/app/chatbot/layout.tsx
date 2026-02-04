import AppLayout from "@/components/app-layout";

export default function ChatbotLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
