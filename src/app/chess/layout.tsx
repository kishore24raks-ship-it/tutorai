import AppLayout from "@/components/app-layout";

export default function ChessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
