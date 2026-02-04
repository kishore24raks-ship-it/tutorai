import AppLayout from "@/components/app-layout";

export default function FootballLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
