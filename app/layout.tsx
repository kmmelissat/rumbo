import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces, Caveat } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { Shell } from "@/components/Shell";

const dm = DM_Sans({ subsets: ["latin"], variable: "--font-dm" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });

export const metadata: Metadata = { title: "Rumbo", description: "Descubre eventos, mercaditos y experiencias locales en El Salvador." };
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#ffffff" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${dm.variable} ${fraunces.variable} ${caveat.variable}`}>
      <body>
        <StoreProvider>
          <Shell>{children}</Shell>
        </StoreProvider>
      </body>
    </html>
  );
}
