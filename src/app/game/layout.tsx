import AppLayout from "@/components/app-layout";

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
