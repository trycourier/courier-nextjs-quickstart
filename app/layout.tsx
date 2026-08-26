import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Courier Inbox — Next.js quickstart",
  description: "A working Courier Inbox in a Next.js App Router app.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
