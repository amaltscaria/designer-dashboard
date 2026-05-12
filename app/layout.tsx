import type { Metadata } from "next";
import { Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Care@Home — Remote Patient Care Ecosystem | Arun T Scaria",
  description: "A comprehensive UX case study for Care@Home — an integrated remote patient monitoring platform spanning three connected products: a clinician web dashboard, a patient mobile app, and a designer admin dashboard.",
  keywords: ["Care@Home", "UX Case Study", "Healthcare UX", "Remote Patient Monitoring", "Arun T Scaria"],
  authors: [{ name: "Arun T Scaria" }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏥</text></svg>",
  },
  openGraph: {
    type: "website",
    url: "https://aruntscaria.com/care-at-home",
    title: "Care@Home — Remote Patient Care Ecosystem",
    description: "UX case study: An integrated healthcare platform with three connected products for clinicians, patients, and admins.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${jetbrainsMono.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
