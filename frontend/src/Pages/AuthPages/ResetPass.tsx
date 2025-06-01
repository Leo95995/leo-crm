import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import ResetPasswordForm from "../../components/auth/ResetPasswordForm";

const ResetPass : React.FC= () => {
  return (
    <>
      <PageMeta
        title="Leo Crm | Reset Password"
        description="Reset password"
      />
      <AuthLayout>
      <ResetPasswordForm/>
      </AuthLayout>
    </>
  );
}
export default ResetPass 