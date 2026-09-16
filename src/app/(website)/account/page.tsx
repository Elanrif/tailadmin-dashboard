import type { Metadata } from "next";
import DashboardAccount from "@/components/website/account";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function AccountPage() {
  return (
    <>
      <DashboardAccount />
    </>
  );
}
