import SignInForm from "@/lib/auth/components/sign-in-form";
import KeycloakSignIn from "@/lib/auth/components/keycloak-sign-in-button";
import environment from "@/config/environment.config";

export const metadata = {
  title: "Sign In",
  description: "Page de connexion",
};

const {
  auth: { provider },
} = environment;

export default function SignInPage() {
  if (provider === "keycloak") {
    return <KeycloakSignIn />;
  }

  return (
    <>
      <SignInForm />
    </>
  );
}
