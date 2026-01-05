import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EnQuéGasto",
  description: "Control de finanzas personales",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* ACÁ NO DEBE HABER NINGÚN NAV NI HEADER, SOLO CHILDREN */}
        {children}
      </body>
    </html>
  );
}