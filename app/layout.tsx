import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// 1. IMPORTAMOS EL PROVIDER
import { ThemeProvider } from "@/components/providers/ThemeProvider";
// 2. IMPORTAMOS EL NAVBAR (Necesario para ver el botón de cambio de tema)
import Navbar from "@/components/Navbar";

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
    // 3. AGREGAMOS suppressHydrationWarning (Obligatorio para next-themes)
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        
        {/* 4. ENVOLVEMOS TODO CON EL THEME PROVIDER */}
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            {/* Pongo el Navbar acá para que aparezca el botón del tema. 
                Si preferís no tenerlo global, podés sacarlo, pero recordá ponerlo en tus páginas. */}
            <Navbar />
            
            {children}
        </ThemeProvider>
      </body>
    </html>
  );
}