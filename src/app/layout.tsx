import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Phytuse - AI Furniture Layout Designer",
  description: "Design your room with AI-powered furniture layout using Claude Vision",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
