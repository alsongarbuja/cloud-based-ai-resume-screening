import PageMeta from "../../components/common/PageMeta";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="KaamAI"
        description="Login in to continue to your dashboard"
      />
      <SignInForm />
    </>
  );
}
