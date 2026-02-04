import AppLayout from "@/components/app-layout";

export default function DrawingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
