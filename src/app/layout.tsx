import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Carnicero & Grill | Cortes Premium & Asado al Carbón",
  description: "Descubre nuestra selección curada de cortes de res selectos de Sonora, parrilladas familiares y especialidades de Zona Grill.",
  keywords: "carniceria boutique, cortes premium, asados, zona grill, ribeye sonora, t-bone, parrilladas a domicilio, embutidos artesanales",
  openGraph: {
    title: "Carnicero & Grill | Cortes Premium & Asados",
    description: "Boutique de carnes selectas de Sonora y Zona Grill los fines de semana.",
    type: "website",
    locale: "es_MX",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-obsidian flex flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
