"use client";

import MainHeader from "@/layout/main-header";
import AppFooter from "@/layout/AppFooter";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-white text-slate-900
     transition-colors duration-200 dark:bg-slate-950 dark:text-slate-50">
      <MainHeader />
      {/* Main App */}
      {children}
      <AppFooter />
    </main>
  );
}
