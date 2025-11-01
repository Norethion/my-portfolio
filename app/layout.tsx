import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { AdminAccessHandler } from "@/components/admin/AdminAccessHandler";
import { ScrollToTop } from "@/components/layout/ScrollToTop";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "My Portfolio",
  description: "Personal portfolio showcasing my projects and skills",
  keywords: ["portfolio", "web developer", "projects"],
  authors: [{ name: "Norethion" }],
  openGraph: {
    title: "My Portfolio",
    description: "Personal portfolio showcasing my projects and skills",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Portfolio",
    description: "Personal portfolio showcasing my projects and skills",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <AdminAccessHandler />
        <ScrollToTop />
      </body>
    </html>
  );
}
