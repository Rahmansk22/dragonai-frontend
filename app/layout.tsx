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
        <link rel="icon" href="/dragon.jpg" />
        <title>Dragon AI</title>
      </head>
      <body className="h-dvh overflow-hidden bg-background-primary text-white">
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
