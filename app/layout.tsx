import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navigation from "@/components/Navigation";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

// Evita prerender estático que quebra com framer-motion no Client Manifest (Next 14 + Vercel)
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Escalas Moria - Gestão de Voluntários",
  description: "Sistema de gestão de voluntários de igreja",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          {children}
          <Navigation />
        </Providers>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
