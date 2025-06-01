import { useModal } from "../../hooks/useModal";
import { Modal } from "../modal";
import Button from "../button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { UsersAPI } from "../../API/User/users";
import { LocalStorageUtils } from "../../Utils/localstorage";
import { setGlobalLoad, setUserData } from "../../store/appStore";

export default function UserMetaCard() {
  const { isOpen, openModal, closeModal } = useModal();

  const userdata = useSelector((state: any) => state.app.userdata);
  const dispatch = useDispatch();
  const [userDetails, setUserDetails] = useState<any>({});

  const getUserData = () => {
    UsersAPI.getUser(userdata._id)
      .then((res) => {
        setTimeout(() => {
          dispatch(setUserData(res?.data));
        }, 500);
      })
      .catch((e) => console.log(e));
  };

  const handleSave = () => {
    UsersAPI.updateUser(userdata._id, userDetails)
      .then((res) => {
        if (res?.data) {
          getUserData();
          const updatedData = LocalStorageUtils.substituteUserData(res?.data);
          dispatch(setUserData(updatedData));
          dispatch(setGlobalLoad(true));
          setTimeout(() => {
            dispatch(setGlobalLoad(false));
          }, 600);
        }
      })
      .catch((e) => console.log(e));
    closeModal();
  };
  return (
    <>
      <div className="p-5 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden rounded-full dark:bg-blue-200 bg-green-600 justify-center flex items-center">
              <span className=" uppercase text-2xl">
                {userdata?.firstName?.split("")[0]}
                {userdata?.lastName?.split("")[0]}
              </span>
            </div>
            <div className="order-3 xl:order-2 capitalize">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left ">
                {userdata?.username}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {userdata.role}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                fill=""
              />
            </svg>
            Modifica
          </button>
        </div>
        <div className="py-5">
          <h4 className="text-xs font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Informazioni Utente
          </h4>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-lg leading-normal text-gray-500 dark:text-gray-400">
                Nome
              </p>
              <p className="text-lg  font-medium text-gray-800 dark:text-white/90">
                {userdata?.firstName}
              </p>
            </div>

            <div>
              <p className="mb-2 text-lg   leading-normal text-gray-500 dark:text-gray-400">
                Cognome
              </p>
              <p className="text-lg font-medium text-gray-800 dark:text-white/90">
                {userdata?.lastName}
              </p>
            </div>

            <div>
              <p className="mb-2 text-lg leading-normal text-gray-500 dark:text-gray-400">
                Email
              </p>
              <p className="text-lg font-medium text-gray-800 dark:text-white/90">
                {userdata?.email}
              </p>
            </div>

            <div></div>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Informazioni personali
            </h4>
            <p className="mb-6 text-md text-gray-500 dark:text-gray-400 lg:mb-7">
              Aggiorna i dettagli del tuo profilo
            </p>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[350px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Informazioni utente{" "}
                  <span className="text-violet-400"> {userdata.username}</span>
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-2 lg:grid-cols-1">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Nome</Label>
                    <Input
                      type="text"
                      onChange={(e) =>
                        setUserDetails({
                          ...userDetails,
                          firstName: e.currentTarget.value,
                        })
                      }
                      value={userDetails.firstName ?? userdata.firstName}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Cognome</Label>
                    <Input
                      type="text"
                      onChange={(e) =>
                        setUserDetails({
                          ...userDetails,
                          lastName: e.currentTarget.value,
                        })
                      }
                      value={userDetails.lastName ?? userdata.lastName}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Email</Label>
                    <Input
                      type="text"
                      onChange={(e) =>
                        setUserDetails({
                          ...userDetails,
                          email: e.currentTarget.value,
                        })
                      }
                      value={userDetails.email ?? userdata.email}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  closeModal();
                  setUserDetails({});
                }}
              >
                Chiudi
              </Button>
              <Button size="sm" onClick={handleSave}>
                Salva
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
