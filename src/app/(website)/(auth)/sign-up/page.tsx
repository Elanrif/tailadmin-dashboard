import SignUpForm from "@/lib/auth/components/sign-up-form";
import KeycloakSignUp from "@/lib/auth/components/keycloak-sign-up-button";

export const metadata = {
  title: "Sign Up",
  description: "Page d'inscription",
};

export default function SignUpPage() {
  if (process.env.AUTH_PROVIDER === "keycloak") {
    return <KeycloakSignUp />;
  }

  return (
    <>
      <SignUpForm />
    </>
  );
}
