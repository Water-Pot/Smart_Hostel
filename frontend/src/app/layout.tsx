import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Hostel Frontend",
  description: "Beautiful Next.js frontend for Smart Hostel Spring Boot backend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
