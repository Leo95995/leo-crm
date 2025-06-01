import { useState } from "react";
import { Link } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../button/Button";
import { UsersAPI } from "../../API/User/users";
import { ISignin } from "../../interfaces/signin";
import { useDispatch } from "react-redux";
import { setUserData, setHasAuth, setGlobalLoad } from "../../store/appStore";
import { useNavigate } from "react-router";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState<{ user: true; password: true }>();
  const [signinData, setSigninData] = useState<ISignin>({
    username: "",
    password: "",
  });

  const dispatch = useDispatch();

  const onSubmit = async (e?: any) => {
   e && e.preventDefault()
    await UsersAPI.signin(signinData)
      .then((res) => {
        if (res?.status) {
          localStorage.setItem("token", JSON.stringify(res.data.token));
          localStorage.setItem("userdata", res.data.userToRet);
          dispatch(setUserData(res.data.userToRet));
          dispatch(setHasAuth(true));
          dispatch(setGlobalLoad(true));
          setTimeout(() => {
            dispatch(setGlobalLoad(false));
            navigate("/");
          }, 1000);
        } else {
          setError({ user: true, password: true });
        }
      })
      .catch((err) => console.log(`errore: ${err}`));
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-2 sm:mb-4">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Accedi
            </h1>
            <p className="text-md text-gray-500 dark:text-gray-400">
              Inserisci username e password per accedere
            </p>
          </div>
          <div>
            <div className="relative py-3 sm:py-5"></div>
            <div>
              <div className="space-y-6">
                <div>
                  <Label>
                    Username <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    className={`${error?.user && "border-red-500"}`}
                    placeholder="Inserisci il tuo username"
                    onChange={(e) =>
                      setSigninData({
                        ...signinData,
                        username: e.currentTarget.value,
                      })
                    }
                    onKeyPress={onSubmit}
                  />
                  {error?.user && (
                    <p className="text-error-500 text-sm">
                      Userame inserito non valido
                    </p>
                  )}
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      className={`${error?.password && "border-red-500"}`}
                      type={showPassword ? "text" : "password"}
                      placeholder="Inserisci la tua password"
                      onChange={(e) =>
                        setSigninData({
                          ...signinData,
                          password: e.currentTarget.value,
                        })
                      }
                      onKeyPress={onSubmit}
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
                  {error?.password && (
                    <p className="text-error-500 text-sm">
                      Password inserita non valida
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <Link
                    to="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Password dimenticata?
                  </Link>
                </div>
                <div>
                  <Button
                    onClick={(e: any) => onSubmit(e)}
                    className="w-full"
                    size="sm"
                  >
                    Accedi
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Non hai un account?{" "}
                <Link
                  to="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Registrati ora
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
