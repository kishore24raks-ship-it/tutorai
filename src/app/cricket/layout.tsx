import AppLayout from "@/components/app-layout";

export default function CricketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
