import { Routes, Route, useLocation } from "react-router";
import SignIn from "./Pages/AuthPages/SignIn";
import SignUp from "./Pages/AuthPages/SignUp";
import NotFound from "./Pages/NotFound/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import ResetPass from "./Pages/AuthPages/ResetPass";
import Clienti from "./Pages/Authorized/Clienti";
import Opportunita from "./Pages/Authorized/Opportunità";
import Utenti from "./Pages/Authorized/Utenti";
import { useSelector } from "react-redux";
import { UsersAPI } from "./API/User/users";
import { useDispatch } from "react-redux";
import { setToken, setUserData } from "./store/appStore";
import ReactLoader from "./components/Loader/Loader";
import { LocalStorageUtils } from "./Utils/localstorage";
import { UserRole } from "./interfaces/pages";
import { setGlobalLoad } from "./store/appStore";

import { AppRoutes } from "./routes/routes";
import ConfirmationPage from "./Pages/AuthPages/ConfirmPage";
import Home from "./Pages/Dashboard/Home";
import ProfiloUtente from "./Pages/UserProfile/UserProfiles";


interface IState {
  app: any;
}

export default function App() {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [hasLoad, setHasLoad] = useState<boolean>(false)
  const location = useLocation();
  const globalLoad = useSelector((state: IState) => state.app.globalLoad);
  const [userRole, setUserRole] = useState<UserRole>({
    name: "",
    permissions: [],
  });

  const token = LocalStorageUtils.extractToken();

  const extractUserData = () => {
    if (!localStorage.getItem("userdata")) {
      return;
    }
    const parser = JSON.parse(atob(localStorage.getItem("userdata") as string));
    dispatch(setUserData(parser));
  };

  const checkToken = () => {
    const token = JSON.parse(localStorage.getItem("token") as string);
    UsersAPI.verifyToken().then((res) => {
      dispatch(setGlobalLoad(true));
      if (res?.data as any) {
        setIsAuth(true);
        extractUserData();
        dispatch(setToken(token));
      } else {
        localStorage.removeItem("userdata");
        localStorage.removeItem("token");
        setIsAuth(false);
      }
      setTimeout(() => {
        dispatch(setGlobalLoad(false));
      }, 1000);
    });
  };

  useEffect(()=> {
    setTimeout(() => {
      setHasLoad(true)
    }, 1000);
  }, [])


  useEffect(() => {
    if (sessionStorage.createContact && location.pathname !== "/clienti") {
      sessionStorage.removeItem("createContact");
    }
    if (localStorage.getItem("token")) {
      checkToken();
    } else {
      const keys = Object.values(AppRoutes.unauthorized);
      if (!keys.includes(location.pathname)) {
        setIsAuth(false);
        navigate("/signin");
      }
    }
  }, [localStorage.getItem("token"), isAuth, token]);

  useEffect(() => {
    if (isAuth) {
      UsersAPI.getUserRole().then((res) => {
        setUserRole(res);
      });
    }
  }, [isAuth]);

  return (
    <>
      <ScrollToTop />
      {globalLoad  || !hasLoad? (
        <div className="w-screen flex justify-center items-center  h-screen">
          {" "}
          <ReactLoader />
        </div>
      ) : (
        <>
          {isAuth ? (
            <Routes>
              <Route element={<AppLayout />}>
                <Route
                  index
                  path={AppRoutes.authorized.home}
                  element={<Home />}
                />

                <Route
                  index
                  path={AppRoutes.authorized.clients}
                  element={
                    <>
                      <Clienti
                        userRole={userRole}
                        authorizedRoles={["admin", "manager", "viewer"]}
                      />
                    </>
                  }
                />
                <Route
                  index
                  path={AppRoutes.authorized.opportunities}
                  element={
                    <>
                      <Opportunita
                        userRole={userRole}
                        authorizedRoles={["admin", "manager", "viewer"]}
                      />
                    </>
                  }
                />
                <Route
                  index
                  path={AppRoutes.authorized.users}
                  element={
                    <>
                      <Utenti
                        userRole={userRole}
                        authorizedRoles={["admin", "manager", "viewer"]}
                      />
                    </>
                  }
                />
                <Route
                  path={AppRoutes.authorized.profile}
                  element={<ProfiloUtente />}
                />
              </Route>
              <Route
                path={AppRoutes.authorized.notFound}
                element={<NotFound />}
              />
            </Routes>
          ) : (
            <Routes>
              <Route
                path={AppRoutes.unauthorized.signin}
                element={<SignIn />}
              />
              <Route
                path={AppRoutes.unauthorized.signup}
                element={<SignUp />}
              />
              <Route
                path={AppRoutes.unauthorized.reset}
                element={<ResetPass />}
              />
              <Route
                path={AppRoutes.unauthorized.newpassword}
                element={<ConfirmationPage />}
              />
              <Route
                path={AppRoutes.unauthorized.notFound}
                element={<NotFound redirect="/signin" />}
              />
            </Routes>
          )}
        </>
      )}
    </>
  );
}
