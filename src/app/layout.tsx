import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/query-provider";
import { ThemeProvider } from "@/context/ThemeContext";
import { SidebarProvider } from "@/context/SidebarContext";
import { Toaster } from "@/components/ui/sonner";
import { AuthUserProvider } from "@/lib/auth/components/auth.context";

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elanrif - Next.js Starter",
  description:
    "A Next.js starter template with TypeScript, Tailwind CSS, and React Query.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
            <AuthUserProvider>
              <SidebarProvider>
                <QueryProvider>
                  <Toaster />
                  {children}
                </QueryProvider>
              </SidebarProvider>
            </AuthUserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
