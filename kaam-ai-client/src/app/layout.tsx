import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { GlobalLoadingOverlay } from "@/components/shared";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Kaam AI - Find Your Dream Job",
    template: "%s | Kaam AI",
  },
  description:
    "Connect talented professionals with amazing opportunities. Find jobs, hire talent, and accelerate your career with Kaam AI.",
  keywords: [
    "jobs",
    "careers",
    "hiring",
    "recruitment",
    "job board",
    "employment",
    "remote jobs",
  ],
  authors: [{ name: "Kaam AI" }],
  openGraph: {
    type: "website",
    title: "Kaam AI - Find Your Dream Job",
    description: "Connect talented professionals with amazing opportunities.",
    siteName: "Kaam AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaam AI - Find Your Dream Job",
    description: "Connect talented professionals with amazing opportunities.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            {children}
            <GlobalLoadingOverlay />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
