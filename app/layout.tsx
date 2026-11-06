import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const dm = DM_Sans({ subsets: ["latin"], variable: "--font-dm" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
const acento = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-acento" });

export const metadata: Metadata = { title: "Rumbo · Plan de negocio", description: "Descubre eventos, mercaditos y experiencias locales en El Salvador." };
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#ffffff", viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${dm.variable} ${fraunces.variable} ${acento.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
