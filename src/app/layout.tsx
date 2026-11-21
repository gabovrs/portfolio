import type { Metadata } from "next";
// Fuentes empaquetadas con el proyecto: el build no depende de Google Fonts.
import "@fontsource-variable/inter";
import "@fontsource-variable/inter-tight";
import "@fontsource/instrument-serif/latin-400.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import "@fontsource-variable/jetbrains-mono";
import { themeScript } from "@/components/ThemeToggle";
import "./globals.css";


export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
  title: { default: "Gabriel Varas · Desarrollador full-stack", template: "%s · Gabriel Varas" },
  description:
    "Portfolio de Gabriel Varas Ibaceta, desarrollador full-stack y estudiante de Ingeniería Civil en Informática y Telecomunicaciones (UDP).",
  icons: { icon: "/logo-gv.svg" },
  openGraph: { type: "website", locale: "es_CL", images: ["/seed/foto.jpg"] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
