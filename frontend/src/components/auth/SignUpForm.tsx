import { useEffect, useState } from "react";
import { Link } from "react-router";
// Icons
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
// Components
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
// Interfaces
import { IUserData } from "../../interfaces/signup";
import { UsersAPI } from "../../API/User/users";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReactLoader from "../Loader/Loader";

import { ToastContainer, toast } from "react-toastify";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState<boolean>(false);
  const [successStep, setSuccessStep] = useState<number>(0);
  const [signupData, setSignupData] = useState<IUserData>({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    termsCondition: false,
  });

  const [error, setError] = useState({
    username: { status: false, message: "" },
    email: { status: false, message: "" },
    password: { status: false, message: "" },
    termsCondition: { status: false, message: "" },
    globalError: "",
  });

  useEffect(() => {
    if (error?.globalError) {
      toast.error(error?.globalError);
    }
  }, [error]);

  const handleFormRegistration = async () => {
    await UsersAPI.createUser(signupData)
      .then((res) => {
        if (res?.status) {
          setRegisterSuccess(true);
        } else {
          if (res?.code === 404) {
            toast.error(res?.data);
          }
          if (res?.code === 401) {
            setError(res.data);
          }
        }
      })
      .catch((error) => console.log(error));
    return;
  };

  return (
    <>
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
      <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
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
                  Registrati
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Inseri la tua mail e la tua password per registrarti!
                </p>
              </div>
              <div>
                <form>
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <Label>
                          Username<span className="text-error-500">*</span>
                        </Label>
                        <Input
                          className={`${
                            error.username.status && "border-red-500"
                          }`}
                          type="text"
                          id="username"
                          name="username"
                          placeholder="Inserisci lo username"
                          onChange={(e) =>
                            setSignupData({
                              ...signupData,
                              username: e.currentTarget.value,
                            })
                          }
                        />
                        {error?.username?.status && (
                          <p className={`${"text-red-500 text-sm"}`}>
                            {error?.username?.message}{" "}
                          </p>
                        )}
                      </div>

                      <div className="sm:col-span-1">
                        <Label>
                          Nome<span className="text-error-500">*</span>
                        </Label>
                        <Input
                          type="text"
                          id="fname"
                          onChange={(e) =>
                            setSignupData({
                              ...signupData,
                              firstName: e.currentTarget.value,
                            })
                          }
                          name="fname"
                          placeholder="Inserisci il tuo nome"
                        />
                      </div>
                      {/* <!-- Last Name --> */}
                      <div className="sm:col-span-1">
                        <Label>
                          Cognome<span className="text-error-500">*</span>
                        </Label>
                        <Input
                          type="text"
                          id="lname"
                          name="lname"
                          onChange={(e) =>
                            setSignupData({
                              ...signupData,
                              lastName: e.currentTarget.value,
                            })
                          }
                          placeholder="Inserisci il tuo cognome"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>
                        Email<span className="text-error-500">*</span>
                      </Label>
                      <Input
                        className={`${
                          error?.email?.status && "border-red-500"
                        }`}
                        type="email"
                        id="email"
                        name="email"
                        onChange={(e) =>
                          setSignupData({
                            ...signupData,
                            email: e.currentTarget.value,
                          })
                        }
                        placeholder="Inserisci la tua email"
                      />
                      {error?.email?.status && (
                        <p className={`${"text-red-500 text-sm"}`}>
                          {error?.email?.message}{" "}
                        </p>
                      )}
                    </div>
                    {/* <!-- Password --> */}
                    <div>
                      <Label>
                        Password<span className="text-error-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          className={`${
                            error?.password?.status && "border-red-500"
                          }`}
                          placeholder="Inserisci la tua password"
                          onChange={(e) =>
                            setSignupData({
                              ...signupData,
                              password: e.currentTarget.value,
                            })
                          }
                          type={showPassword ? "text" : "password"}
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                        >
                          {showPassword ? (
                            <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                          ) : (
                            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                          )}
                        </span>
                      </div>
                      {error?.password.status && (
                        <p className={`${"text-red-500 text-sm"}`}>
                          {error?.password?.message}{" "}
                        </p>
                      )}
                    </div>
                    {/* <!-- Checkbox --> */}
                    <div className="flex items-center gap-3">
                      <Checkbox
                        className={`${
                          error?.termsCondition?.status && "border-red-500"
                        }`}
                        checked={isChecked}
                        onChange={() => {
                          setIsChecked((prev) => !prev);
                          setSignupData({
                            ...signupData,
                            termsCondition: !signupData.termsCondition,
                          });
                        }}
                      />
                      <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                        Creando un account accetti i
                        <span className="text-gray-800 dark:text-white/90">
                          {" "}
                          Termini e le Condizioni,
                        </span>{" "}
                        e la nostra{" "}
                        <span className="text-gray-800 dark:text-white">
                          Privacy Policy
                        </span>
                      </p>
                    </div>
                    {error?.termsCondition.status && (
                      <p className={`${"text-red-500 text-sm"}`}>
                        {error?.termsCondition?.message}{" "}
                      </p>
                    )}
                    {/* <!-- Button --> */}
                    <div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleFormRegistration();
                        }}
                        className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                      >
                        Registrati
                      </button>
                    </div>
                  </div>
                </form>

                <div className="mt-5">
                  <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                    Hai gia un account? {""}
                    <Link
                      to="/signin"
                      className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                    >
                      Accedi ora
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
        {registerSuccess &&
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
                          className="text-white"
                          style={{ width: "64px", height: "64px" }}
                        />

                        <h1 className="mb-2 font-semibold text-white text-title-sm dark:text-white/90 sm:text-title-md">
                          Successo
                        </h1>
                      </div>
                      <div className="flex flex-col p-5 my-1 items-center gap-5">
                        <p className="text-gray-dark pb-3">
                          {" "}
                          Congratulazioni il tuo account è stato creato con
                          successo
                        </p>
                        <Link to={`/signin`}>
                          <button className="btn bg-green-500 w-34 shadow-2xs p-3 rounded-4xl text-white hover:opacity-90">
                            Continua
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
    </>
  );
}
