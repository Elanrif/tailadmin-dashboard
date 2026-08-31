import ResetPasswordForm from "@/lib/auth/components/reset-password-form";

export const metadata = {
  title: "Reset Password",
  description: "Page de réinitialisation du mot de passe",
};

export default function ResetPasswordPage() {
  return (
    <>
      <ResetPasswordForm />
    </>
  );
}
