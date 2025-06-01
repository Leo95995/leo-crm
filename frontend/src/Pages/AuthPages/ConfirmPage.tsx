import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import NewPasswordForm from "../../components/auth/NewPasswordForm";

const ConfirmationPage : React.FC= () => {
  return (
    <>
      <PageMeta
        title="Leo CRM | Nuova Password"
        description="Nuova password"
      />
      <AuthLayout>
        <NewPasswordForm/>
      </AuthLayout>
    </>
  );
}
export default ConfirmationPage 