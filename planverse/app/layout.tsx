import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Planverse — Interior Layout Planning",
  description: "AI-powered interior room layout planning with drag & drop furniture",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
