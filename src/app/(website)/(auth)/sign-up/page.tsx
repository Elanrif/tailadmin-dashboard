import SignUpForm from "@/lib/auth/components/sign-up-form";
import KeycloakSignUp from "@/lib/auth/components/keycloak-sign-up-button";
import environment from "@/config/environment.config";

export const metadata = {
  title: "Sign Up",
  description: "Page d'inscription",
};
const {
  auth: { provider },
} = environment;

export default function SignUpPage() {
  if (provider === "keycloak") {
    return <KeycloakSignUp />;
  }

  return (
    <>
      <SignUpForm />
    </>
  );
}
