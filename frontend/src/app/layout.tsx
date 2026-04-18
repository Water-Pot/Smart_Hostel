import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/navigation";

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
      <body className="min-h-full">
        <Navigation />
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-8">
          <main className="w-full">{children}</main>
        </div>
      </body>
    </html>
  );
}
