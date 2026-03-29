import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Product Analytics Dashboard",
    template: "%s | Product Analytics",
  },
  description:
    "A high-performance product analytics dashboard built with Next.js, featuring real-time updates, advanced filtering, and optimized rendering for large datasets.",
  keywords: [
    "Next.js",
    "React",
    "Product Dashboard",
    "Analytics",
    "Performance Optimization",
  ],
  authors: [{ name: "Mahammad Shaheed" }],
  creator: "Mahammad Shaheed",

  metadataBase: new URL("http://localhost:3000"),

  // PWA + Theme Color
  manifest: "/manifest.json",

  // Open Graph
  openGraph: {
    title: "Product Analytics Dashboard",
    description:
      "Scalable product analytics dashboard with real-time updates and advanced filtering.",
    type: "website",
  },

  // Icons
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192.png",
  },

  // Mobile / Apple PWA Support
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Product Dashboard",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
