import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

const SignUp :React.FC = () => {
  return (
    <>
      <PageMeta
        title="Leo CRM | Registration Page "
        description="Leo CRM"
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}


export default SignUp