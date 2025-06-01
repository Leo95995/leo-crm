import { useEffect, useState } from "react";
// Interface
import { IPage } from "../../../interfaces/pages";
// Table
import UsersTable from "./UserTables";
// Role check function
import { RoleTester } from "../../../Utils/roleTester";
import PageMeta from "../../../components/common/PageMeta";

const Utenti: React.FC<IPage> = ({ authorizedRoles, userRole }) => {
  const [allowedActions, setAllowedActions] = useState<string[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (userRole) {
      const permission = RoleTester.verifyOperations(
        userRole.name,
        authorizedRoles
      );
      setHasPermission(permission);
      setAllowedActions(userRole?.permissions);
    }
  }, [userRole]);

  return (
    <>
      <PageMeta title="LEO CRM | Utenti " description="LEO CRM Pagina Utenti" />
      {hasPermission ? (
        <UsersTable
          allowedActions={allowedActions}
          successMessage={successMessage}
          setSuccessMessage={setSuccessMessage}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      ) : (
        "Non sei autorizzato"
      )}
    </>
  );
};

export default Utenti;
