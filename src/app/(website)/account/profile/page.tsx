import { Metadata } from "next";
import MyProfile from "@/components/website/account/my-profile";

export const metadata: Metadata = {
  title: "Next.js Profile | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Profile page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function ProfilePage() {
  return (
    <>
      <MyProfile />
    </>
  );
}
