import AppLayout from "@/components/app-layout";

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
