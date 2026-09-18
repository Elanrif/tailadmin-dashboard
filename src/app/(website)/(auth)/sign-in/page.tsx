import SignInForm from "@/lib/auth/components/sign-in-form";
import KeycloakSignIn from "@/lib/auth/components/keycloak-sign-in-button";

export const metadata = {
  title: "Sign In",
  description: "Page de connexion",
};

export default function SignInPage() {
  if (process.env.NEXT_PUBLIC_AUTH_PROVIDER === "keycloak") {
    return <KeycloakSignIn />;
  }

  return (
    <>
      <SignInForm />
    </>
  );
}
