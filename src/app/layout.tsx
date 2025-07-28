import QueryProvider from "@/lib/query-provider";
import "@/styles/globals.css";

import "react-toastify/dist/ReactToastify.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: {
    default: "MyShop - Product Management System",
    template: "%s - MyShop"
  },
  description: "A comprehensive product management system built with Next.js, TanStack Query, and modern web technologies.",
  keywords: ["product management", "e-commerce", "Next.js", "React", "TanStack Query"],
  authors: [{ name: "MyShop Team" }],
  creator: "MyShop",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://myshop.com",
    title: "MyShop - Product Management System",
    description: "A comprehensive product management system built with Next.js, TanStack Query, and modern web technologies.",
    siteName: "MyShop",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyShop - Product Management System",
    description: "A comprehensive product management system built with Next.js, TanStack Query, and modern web technologies.",
  },
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <ToastContainer 
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
              {children}
            </div>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
