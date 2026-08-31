import ResetPasswordForm from "@/lib/auth/components/reset-password-form";

export const metadata = {
  title: "Reset Password",
  description: "Page to reset your password",
};

export default function ResetPasswordPage() {
  return (
    <>
      <ResetPasswordForm />
    </>
  );
}
