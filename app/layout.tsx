"use client";
import "./globals.css";
import { ClerkProvider } from "../lib/clerk";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/hero_dragon.jpg?v=2" type="image/jpeg" />
        <link rel="shortcut icon" href="/hero_dragon.jpg?v=2" type="image/jpeg" />
        <title>Dragon GPT</title>
      </head>
      <body className="min-h-screen bg-background-primary text-white">
        <ClerkProvider>
          <header>
            {/* Authentication UI removed. Add your own sign-in logic here if needed. */}
          </header>

          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
