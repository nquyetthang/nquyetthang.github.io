import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quiz Voice Player",
  description: "Show quiz questions one-by-one with machine voice reading",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
