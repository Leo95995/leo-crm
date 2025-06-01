import { useState } from "react";
import { Link } from "react-router";
import { CheckCircleIcon, ChevronLeftIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../button/Button";
import { UsersAPI } from "../../API/User/users";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import ReactLoader from "../Loader/Loader";

const ResetPasswordForm: React.FC = () => {
  const [username, setUserName] = useState<string>("");
  const [loader, setLoader] = useState<boolean>();
  const [successStep, setSuccessStep] = useState<number>(0);
  const [resetSuccess, setResetSuccess] = useState<boolean>(false);

  const onSubmit = async (e: any) => {
    e.preventDefault();

    // Per ora blocco e simulo lo stato

    // return
    setLoader(true);
    const res = (await UsersAPI.sendResetLink(username)) as boolean;
    if (res) {
      setLoader(false);
      setResetSuccess(true);
    } else {
      setLoader(false);
      toast.error(`Errore! \n L'username inserito non  valido`);
    }
    return res;
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
      {!loader ? (
        <>
          <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
            <Link
              to="/signin"
              className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <ChevronLeftIcon className="size-5" />
              Torna alla pagina di accesso
            </Link>
          </div>
          <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div>
              <div className="mb-5 sm:mb-8">
                <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                  Hai dimenticato la password?
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Scrivi il tuo username e ti invieremo un link per reimpostare
                  la password
                </p>
              </div>
              <div>
                <form>
                  <div className="space-y-6">
                    <div>
                      <Label>
                        Username <span className="text-error-500">*</span>{" "}
                      </Label>
                      <Input
                        placeholder="Inserisci il tuo username"
                        type="text"
                        onChange={(e) => {
                          setUserName(e.currentTarget.value);
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
        </>
      ) : (
        <>
         <div className="flex w-full justify-center items-center h-screen">
          <ReactLoader  />
          </div>
        </>
      )}
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
                      <p className="text-gray-dark pb-3">
                        {" "}
                        Email per il reset password inviata con successo.
                        Verifica la tua casella di posta
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
    </div>
  );
};

export default ResetPasswordForm;
