import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Program Admin Dashboard | Arun T Scaria",
  description: "Administrative dashboard for program management, featuring comprehensive analytics, user management, and workflow optimization tools.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚙️</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
