import type { Metadata } from "next";
import { Source_Sans_3, Cormorant_Garamond } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
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
  title: "Bonsai - MCAT Study with Spaced Repetition | Ace Your Medical School Exam",
  description: "Master the MCAT with Bonsai's scientifically-proven spaced repetition system. 50,000+ practice questions, AI-powered learning, and personalized study schedules. Join 12,500+ students improving their scores.",
  keywords: [
    "MCAT prep",
    "MCAT study",
    "spaced repetition",
    "medical school admission",
    "MCAT practice questions",
    "MCAT flashcards",
    "MCAT review",
    "medical school test prep",
    "AAMC MCAT",
    "MCAT biology",
    "MCAT chemistry",
    "MCAT psychology",
    "CARS practice",
    "pre-med study",
    "adaptive learning MCAT"
  ],
  authors: [{ name: "Bonsai" }],
  creator: "Bonsai",
  publisher: "Bonsai",
  applicationName: "Bonsai MCAT Prep",
  category: "Education",
  openGraph: {
    title: "Bonsai - Master the MCAT with Spaced Repetition",
    description: "The most effective way to prepare for the MCAT. Our AI-powered spaced repetition system helps you retain more, study smarter, and achieve your target score.",
    type: "website",
    locale: "en_US",
    siteName: "Bonsai MCAT Prep",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bonsai - Master the MCAT with Spaced Repetition",
    description: "The most effective way to prepare for the MCAT. AI-powered learning that adapts to how you learn.",
    creator: "@bonsaimcat",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
