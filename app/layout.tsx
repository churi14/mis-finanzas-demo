import type { Metadata, Viewport } from "next"; // <--- Agregamos Viewport acá
import { Inter } from "next/font/google";
import "./globals.css";

// Componentes y Providers
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Navbar from "@/components/Navbar";
import FeedbackButton from "@/components/FeedbackButton";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

// 1. CONFIGURACIÓN VISUAL PARA CELULARES (PWA)
// Esto define el color de la barra del navegador y evita el zoom molesto en inputs
export const viewport: Viewport = {
  themeColor: "#0f172a", // Color azul oscuro (slate-900) para que combine con tu navbar
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Evita que se haga zoom al tocar inputs en iPhone
};

// 2. METADATA Y MANIFIESTO
export const metadata: Metadata = {
  title: "EnQuéGasto | Controlá tus Finanzas y Cuotas",
  description: "La herramienta gratuita con acento argentino para ordenar tus números. Calculá cuotas, gestioná ahorros y visualizá tus gastos sin planillas complejas.",
  keywords: ["finanzas", "argentina", "control de gastos", "cuotas", "ahorro", "gratis"],
  authors: [{ name: "En Red Consultora", url: "https://enredconsultora.com" }],
  
  // VINCULAMOS EL ARCHIVO DE LA APP MÓVIL
  manifest: "/manifest.json", 

  openGraph: {
    title: "EnQuéGasto - Tu economía, ordenada.",
    description: "Olvidate del Excel. Empezá a controlar tus gastos y cuotas hoy mismo. 100% Gratis.",
    url: "https://enquegasto.vercel.app", // Cambiá esto por tu URL real
    siteName: "EnQuéGasto",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dashboard de EnQuéGasto",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EnQuéGasto | Finanzas Personales Simples",
    description: "Controlá tus gastos y cuotas fácil. Desarrollado por En Red Consultora.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        
        <ThemeProvider
            attribute="class"
            defaultTheme="light" // Forzamos light por ahora
            enableSystem={false}
            disableTransitionOnChange
        >
            {/* Barra de Navegación Global */}
            <Navbar />
            
            {/* Contenido de la página */}
            {children}

            {/* Botón flotante de Sugerencias */}
            <FeedbackButton />
            
            {/* Métricas de Vercel */}
            <Analytics />
            
        </ThemeProvider>

      </body>
    </html>
  );
}