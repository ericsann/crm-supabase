import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CRM Supabase",
  description: "Sistema de CRM com Supabase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen">
          <aside className="w-64 bg-gray-800 text-white p-4">
            <h1 className="text-xl font-bold mb-6">CRM</h1>
            <nav className="space-y-2">
              <Link
                href="/"
                className="block py-2 px-4 rounded hover:bg-gray-700"
              >
                Início
              </Link>
              <Link
                href="/customers"
                className="block py-2 px-4 rounded hover:bg-gray-700"
              >
                Clientes
              </Link>
              <Link
                href="/tickets"
                className="block py-2 px-4 rounded hover:bg-gray-700"
              >
                Tickets
              </Link>
            </nav>
          </aside>
          <main className="flex-1 bg-gray-50">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
