import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

const SignIn : React.FC= () => {
  return (
    <>
      <PageMeta
        title="Leo CRM  | Pagina di Login"
        description="Pagina di login"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
export default SignIn 