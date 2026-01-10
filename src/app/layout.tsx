import type { Metadata } from "next";
import { Source_Sans_3, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-logo",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bonsai - MCAT Study",
  description: "Master your MCAT prep with spaced repetition",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/bonsaitransparent.svg', type: 'image/svg+xml' },
    ],
    apple: '/bonsaitransparent.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sourceSans.variable} ${cormorantGaramond.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
