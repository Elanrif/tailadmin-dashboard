import SignInForm from "@/lib/auth/components/sign-in-form";
import KeycloakSignInButton from "@/lib/auth/components/keycloak-sign-in-button";

export const metadata = {
  title: "Sign In",
  description: "Page de connexion",
};

export default function SignInPage() {
  if (process.env.AUTH_PROVIDER === "keycloak") {
    return <KeycloakSignInButton />;
  }

  return (
    <>
      <SignInForm />
    </>
  );
}
