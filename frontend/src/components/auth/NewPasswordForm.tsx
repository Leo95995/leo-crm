import { useEffect, useState } from "react";
import { Link } from "react-router";
import { CheckCircleIcon, ChevronLeftIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../button/Button";
import { UsersAPI } from "../../API/User/users";
import { toast } from "react-toastify";
import ReactLoader from "../Loader/Loader";
import { ToastContainer } from "react-toastify";

const NewPasswordForm: React.FC = () => {
  const [is_valid_token, setIsValidToken] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [passwords, setPasswords] = useState({
    password1: "",
    password2: "",
  });
  const [successStep, setSuccessStep] = useState<number>(0);
  const [resetSuccess, setResetSuccess] = useState<boolean>(false);

  const verify_reset_token = async (resetToken: string) => {
    const res = await UsersAPI.checkToken(resetToken);
    if (res) {
      console.log(res);
      setIsValidToken(true);
      setUserId(res.user_id);
    } else {
      console.error(res);
    }
  };

  const get_url_param = (paramToExtract: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get(paramToExtract);
    return myParam?.trim() as string;
  };

  useEffect(() => {
    const reset_token = get_url_param("token");
    verify_reset_token(reset_token);
  }, []);

  // Funzionalità che si attiva alla conferma del nostro form
  const onSubmit = async (e: any) => {
    e.preventDefault();
    const passwords_equality = checkPasswords();
    if (passwords_equality) {
      const res = await UsersAPI.resetUserPassword(passwords.password1, userId);
      console.log(res);
      if (res?.status == 'success') {
        toast.success(`Reset effettuato con successo`);
        setResetSuccess(true)
      } else {
        toast.error(`${res?.message}`);
        return
      }
    }
  };
  // Funzione che si occupa di verificare le password tra loro.
  const checkPasswords = () => {
    const { password1, password2 } = passwords;
    if (password1 !== password2) {
      toast.error(`Le password inserite sono diverse`);
      return;
    }
    if (password1.length < 8) {
      toast.error(`La password inserita è troppo corta`);
      return;
    }
    return true;
  };

  return (
    <div className="flex flex-col flex-1">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
        <Link
          to="/signin"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Torna alla pagina di accesso
        </Link>
      </div>
      {is_valid_token ? (
        <>
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div>
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Inserisci una nuova password
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Inserisci una nuova password
              </p>
            </div>
            <div>
              <form>
                <div className="space-y-6">
                  <div>
                    <Label>
                      Nuova password <span className="text-error-500">*</span>{" "}
                    </Label>
                    <Input
                      placeholder="Inserisci nuova password"
                      type="text"
                      onChange={(e) => {
                        setPasswords({
                          ...passwords,
                          password1: e.currentTarget.value,
                        });
                      }}
                    />
                  </div>
                  <div>
                    <Label>
                      Ripeti la password{" "}
                      <span className="text-error-500">*</span>{" "}
                    </Label>
                    <Input
                      placeholder="Ripeti di nuovo la password"
                      type="text"
                      onChange={(e) => {
                        setPasswords({
                          ...passwords,
                          password2: e.currentTarget.value,
                        });
                      }}
                    />
                  </div>
                  <div>
                    <Button
                      onClick={(e: void) => onSubmit(e)}
                      className="w-full"
                      size="sm"
                    >
                      Conferma
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
         {resetSuccess &&
            setTimeout(() => {
              if (successStep === 0) setSuccessStep(1);
            }, 10) && (
              <>
                <div className="fixed w-full flex items-center justify-center h-full bg-gray-dark z-200">
                  <div className="flex  flex-1 justify-center text-center items-center flex-col ">
                    {successStep === 1 &&
                      setTimeout(() => {
                        setSuccessStep(2);
                      }, 1200) && <ReactLoader />}
                    {successStep === 2 && (
                      <div className="shadow-xl text-white rounded-md w-108 h-96 rounded-2xl dark:bg-white bg-white  dark:text-gray-400">
                        <div className="flex justify-center items-center flex-col gap-0 bg-green-500 h-44 rounded-md rounded-b-none">
                          <CheckCircleIcon
                            className="text-white bg-white rounded-full"
                            style={{
                              width: "64px",
                              height: "64px",
                              color: "white",
                            }}
                          />

                          <h1 className="mb-2 font-semibold text-white text-title-sm dark:text-white/90 sm:text-title-md">
                            Successo
                          </h1>
                        </div>
                        <div className="flex flex-col p-5 my-1 items-center gap-5">
                          <p className="text-gray-dark pb-3 m-0">
                          La procedura di reset password è andata a buon fine.
                          {"\n"} Puoi accedere al tuo account inserendo la tua nuova password
                          </p>
                          <Link to={`/signin`}>
                            <button className="btn bg-green-500 w-34 shadow-2xs p-3 rounded-4xl text-white hover:opacity-90">
                              Torna alla login
                            </button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
        </>
      ) : (
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div>
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold flex text-gray-800 text-6xl justify-center dark:text-white/90">
                Ops!
              </h1>
              <h2 className="text-2xl py-2 flex justify-center">
                Il link inserito non è valido
              </h2>
              <img
                src="/images/error/404.svg"
                alt="404"
                className="dark:hidden"
              />
              <img
                src="/images/error/404-dark.svg"
                alt="404"
                className="hidden dark:block"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewPasswordForm;
