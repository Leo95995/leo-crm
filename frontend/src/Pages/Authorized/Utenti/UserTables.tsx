//React imports

import { useEffect, useState } from "react";
// Components
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/table";
import { Modal } from "../../../components/modal";
import Label from "../../../components/form/Label";
//Apis
import { UsersAPI } from "../../../API/User/users";
import { useDispatch, useSelector } from "react-redux";
//Icons
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Badge, Tooltip } from "@mui/material";
import MovingIcon from "@mui/icons-material/Moving";
// UserInfo
// Icons
import ClearIcon from "@mui/icons-material/Clear";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { userInfo } from "./userTableConfig";

import Button from "../../../components/button/Button";
import Input from "../../../components/form/input/InputField";
// IMPORT API DATAS

import { setInternalLoad } from "../../../store/appStore";
import ReactLoader from "../../../components/Loader/Loader";
import Select from "../../../components/form/Select";
import { LocalStorageUtils } from "../../../Utils/localstorage";
import CustomPagination from "../../../components/pagination/customPagination";
import SearchIcon from "@mui/icons-material/Search";
// Metods
import { getItalianRole } from "../../../Utils/options";
import { userFilters } from "../../shared-datas/generic-datas";
import EmptyList from "../../../components/empty/emptyList";
import { UserIcon } from "../../../icons";
interface IUserTable {
  allowedActions: string[];
  [key: string]: any;
}

const UsersTable: React.FC<IUserTable> = ({
  allowedActions,
  errorMessage,
  setSuccessMessage,
  successMessage,
}) => {
  const [userList, setUserList] = useState<any[]>([]);
  const userdata = useSelector((state: any) => state?.app?.userdata);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [promoteModal, setPromoteModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<any>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>("");
  const [isWriting, setIsWriting] = useState<boolean>(false);
  const [totalResults, setTotalResults] = useState<number>();
  const [sortOrder, setSortOrder] = useState<any>({ order: "", field: "" });
  const pageSize = 10;

  const dispatch = useDispatch();
  const internalLoad = useSelector((state: any) => state.app.internalLoad);

  const [optionsFilters, setOptionsFilters] = useState<string>("");

  const getFilterVal = () => {
    const selected_value_filter = userFilters.find(
      (filter) => filter.label === optionsFilters
    )?.value;
    return selected_value_filter;
  };

  const getSortedVal = () => {
    const selected_value_filter = userFilters.find(
      (filter) => filter.label === sortOrder?.field
    )?.value;

    const toRet = {
      order: sortOrder.order,
      field: selected_value_filter as string,
    };

    return toRet;
  };

  // Verifico se l'utente sta scrivendo e permetto di fare la chiama solo se non sta scrivendo l'utente per mantenere i valori legati ai filtri
  useEffect(() => {
    if (
      searchText === "" ||
      (sortOrder?.order && sortOrder?.field && !isWriting)
    ) {
      dispatch(setInternalLoad(true));
      let usersData = UsersAPI.getUsers(
        1,
        searchText,
        getFilterVal(),
        getSortedVal()
      );
      usersData.then((res) => {
        if (res?.data) {
          const { users, total } = res.data;
          setUserList(users);
          setTotalResults(total);
          setTimeout(() => {
            dispatch(setInternalLoad(false));
          }, 250);
        } else {
          console.log(`Im unable to fetch users right now ${currentPage}`);
          setTimeout(() => {
            dispatch(setInternalLoad(false));
          }, 250);
        }
      });
    }
  }, [totalResults, searchText, sortOrder]);

  useEffect(() => {
    handleFilterSelection();
  }, []);

  const handleFilterSelection = (val?: string) => {
    const selected_userfilter = userFilters.find(
      (userFilter) => userFilter.value === (val ? val : "username")
    );
    setOptionsFilters(selected_userfilter?.label as string);
  };

  /**
   * Gestione della ricerca
   */
  const handleSearch = () => {
    UsersAPI.getUsers(1, searchText, getFilterVal(), getSortedVal()).then(
      (res) => {
        setUserList(res?.data?.users);
        setTotalResults(res?.data?.total);
        setCurrentPage(1);
      }
    );
  };
  /**
   * Gestione del cambio pagina
   */
  const handleChangePage = (pageNumber: number) => {
    UsersAPI.getUsers(
      pageNumber,
      searchText,
      getFilterVal(),
      getSortedVal()
    ).then((res) => {
      setCurrentPage(pageNumber);
      setUserList(res?.data.users);
      setTotalResults(res?.data?.total);
    });
    setTimeout(() => {
      scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, 200);
  };

  const handleDelete = () => {
    UsersAPI.deleteUser(selectedUser._id)
      .then((res) => {
        if (res) {
           setSuccessMessage("Utente eliminato con successo");
          setTimeout(() => {
            setSuccessMessage("");
          }, 3000);
          UsersAPI.getUsers().then((res) => {
            if (res?.data) {
              const { users } = res.data;
              setUserList(users);
            }
          });
        }
      })
      .catch((e) => console.log(e));
    setDeleteModal(false);
  };

  const handleUpdate = () => {
    const modifiedDatas = {
      email: selectedUser.email,
      firstName: selectedUser.firstName,
      lastName: selectedUser.lastName,
    };

    UsersAPI.updateUser(selectedUser._id, modifiedDatas)
      .then((res) => {
        if (selectedUser._id === userdata._id) {
          LocalStorageUtils.substituteUserData(res?.data);
        }
         setSuccessMessage("Utente aggiornato con successo");
          setTimeout(() => {
            setSuccessMessage("");
          }, 3000);
        let usersData = UsersAPI.getUsers();
        usersData.then((res) => {
          if (res?.data) {
            const { users } = res.data;
            setUserList(users);
          }
        });
        dispatch(setInternalLoad(true));
        setTimeout(() => {
          dispatch(setInternalLoad(false));
        }, 500);
      })
      .catch((e) => console.log(e));
    setEditModal(false);
  };

  const handlePromotion = () => {
    UsersAPI.promoteUser(selectedUser?._id, selectedUser?.role)
      .then(() => {
        UsersAPI.getUsers().then((res) => {
          if (res?.data) {
            setSuccessMessage("Ruolo utente aggiornato con successo");
          setTimeout(() => {
            setSuccessMessage("");
          }, 3000);
            const { users } = res.data;
            setUserList(users);
          }
        });
        dispatch(setInternalLoad(true));
        setTimeout(() => {
          dispatch(setInternalLoad(false));
        }, 500);
      })
      .catch((e) => console.log("errore nel promuovere", e));
    setPromoteModal(false);
  };

  return (
    <>
      <div className="flex gap-5 my-6 flex-col sm:flex-row">
        <div className="flex flex-col">
          <Select
            options={userFilters}
            onChange={handleFilterSelection}
            placeholder="Ricerca per"
            staticVal="username"
          />
        </div>
        <div className="flex">
          <Input
            type="text"
            onKeyPress={handleSearch}
            placeholder={`${
              optionsFilters
                ? `Ricerca per ${optionsFilters}`
                : `Seleziona un criterio di ricerca`
            }`}
            disabled={!optionsFilters}
            onChange={(e) => {
              setIsWriting(true);
              setSearchText(e.currentTarget.value);
              setTimeout(() => {
                setIsWriting(false);
              }, 1000);
            }}
          />
          <Button onClick={handleSearch} size="sm">
            <div className="visible sm:collapse">Cerca</div>{" "}
            <SearchIcon style={{ fontSize: "18px" }} className="text-lg" />
          </Button>
        </div>
      </div>
      <>
        {successMessage && (
            <div className="text-green-600 bg-green-100 p-3 rounded fixed  z-99999 top-20 right-10">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="text-red-600 bg-red-100 p-3 rounded fixed z-99999 top-20 right-10">
              {errorMessage}
            </div>
          )}
        <p className="py-3 dark:text-white">
          Risultati totali <b>{totalResults}</b>
        </p>

        <>
          {!internalLoad ? (
            <>
              {!userList.length ? (
                <EmptyList
                  icon={<UserIcon style={{ fontSize: "18px" }} />}
                  mainText={`Nessun risultato`}
                  secondaryText={`Nessun risultato trovato per il testo ricercato`}
                />
              ) : (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                  <div className="max-w-full overflow-x-auto sm:min-h-150">
                    <Table>
                      <TableHeader
                        className={`border-b border-gray-100 dark:border-white/[0.05] `}
                      >
                        <TableRow>
                          {userInfo.map((datum) => {
                            if (
                              datum === "Azioni" &&
                              !allowedActions.includes("update")
                            ) {
                              return;
                            }

                            const isTheSelectedField =
                              sortOrder?.order && datum === sortOrder?.field;
                            return (
                              <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                              >
                                <div className="flex">
                                  <div
                                    className={`w-fit px-2 hover:cursor-pointer flex items-center gap-1 ${
                                      datum === sortOrder?.field &&
                                      `text-gray-500 font-bold dark:text-red-50`
                                    }`}
                                    onClick={() => {
                                      if (datum !== "Azioni") {
                                        sortOrder.order === "ASC"
                                          ? setSortOrder({
                                              order: "DESC",
                                              field: datum,
                                            })
                                          : setSortOrder({
                                              order: "ASC",
                                              field: datum,
                                            });
                                      }
                                    }}
                                  >
                                    {datum}
                                    {isTheSelectedField ? (
                                      sortOrder.order === "ASC" ? (
                                        <>
                                          <KeyboardArrowUpIcon />
                                        </>
                                      ) : (
                                        <>
                                          <KeyboardArrowDownIcon />
                                        </>
                                      )
                                    ) : (
                                      <>
                                        {datum !== "Azioni" && (
                                          <KeyboardArrowDownIcon />
                                        )}
                                      </>
                                    )}
                                  </div>

                                  {isTheSelectedField && (
                                    <Tooltip
                                      title={"Rimuovi filtro"}
                                      placement="right"
                                      className="border-2"
                                    >
                                      <span
                                        onClick={() => setSortOrder({})}
                                        className="hover:bg-gray-400 p-1 rounded-full hover:text-black flex items-center justify-center cursor-pointer"
                                      >
                                        <ClearIcon
                                          style={{
                                            height: "14px",
                                            width: "14px",
                                          }}
                                        />
                                      </span>
                                    </Tooltip>
                                  )}
                                </div>
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      </TableHeader>

                      {/* Table Body */}
                      <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {userList?.map((user) => (
                          <TableRow key={user?.username}>
                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 overflow-hidden rounded-full dark:bg-blue-200 bg-green-600 justify-center flex items-center">
                                  <span className=" uppercase">
                                    {user?.firstName?.split("")[0]}
                                    {user?.lastName?.split("")[0]}
                                  </span>
                                </div>
                                <div>
                                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                    {user.username}
                                    {userdata.username === user.username ? (
                                      <Badge className="bg-blue-400 font-bold w-14 rounded-4xl p-1 mx-4 flex justify-center items-center rounded-2xl">
                                        TU
                                      </Badge>
                                    ) : (
                                      ""
                                    )}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                              {user?.email}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                              <div className="flex -space-x-2">
                                {user?.firstName}
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                              {user?.lastName}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                              {getItalianRole(user?.role)}
                            </TableCell>
                            {allowedActions.includes("update") && (
                              <TableCell className="px-4 py-3  text-gray-500 text-theme-sm w-32 dark:text-gray-400">
                                {allowedActions.includes("delete") &&
                                  userdata.username !== user.username && (
                                    <Tooltip title="Elimina">
                                      <button
                                        className="hover:text-red-400 active:scale-95"
                                        onClick={() => {
                                          setDeleteModal(true);
                                          setSelectedUser(user);
                                        }}
                                      >
                                        {" "}
                                        <DeleteIcon />
                                      </button>
                                    </Tooltip>
                                  )}
                                <Modal
                                  isOpen={deleteModal}
                                  onClose={() => setDeleteModal(false)}
                                  className="max-w-[700px] m-4"
                                  children={
                                    <div>
                                      {" "}
                                      <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 dark:text-white lg:p-11">
                                        <div className="px-2 pr-14">
                                          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                                            Sei sicuro di voler eliminare
                                            l'account??
                                          </h4>
                                          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                                            Se confermi l'utente verrà
                                            cancellato per sempre
                                          </p>
                                        </div>
                                        <form className="flex flex-col">
                                          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                                            <Button
                                              variant="outline"
                                              onClick={() =>
                                                setDeleteModal(false)
                                              }
                                            >
                                              Chiudi
                                            </Button>
                                            <Button onClick={handleDelete}>
                                              Conferma
                                            </Button>
                                          </div>
                                        </form>
                                      </div>
                                    </div>
                                  }
                                />
                                <Tooltip title="Modifica">
                                  <button
                                    onClick={() => {
                                      setEditModal(true);
                                      setSelectedUser(user);
                                    }}
                                    className="hover:text-yellow-400 p-1 rounded active:scale-95"
                                  >
                                    {" "}
                                    <EditIcon />
                                  </button>
                                </Tooltip>
                                <Modal
                                  isOpen={editModal}
                                  onClose={() => setEditModal(false)}
                                  className="max-w-[700px] m-4"
                                  children={
                                    <div>
                                      <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl  dark:bg-gray-900 lg:p-11">
                                        <div className="px-2 pr-14">
                                          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                                            Modifica Utente
                                          </h4>
                                          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                                            Modifica i dettagli dell'utente{" "}
                                            <b className="text-violet-500">
                                              {selectedUser?.username}
                                            </b>
                                          </p>
                                        </div>
                                        <div className="px-2 overflow-y-auto custom-scrollbar">
                                          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                                            <div>
                                              <Label>Nome</Label>
                                              <Input
                                                type="text"
                                                value={selectedUser?.firstName}
                                                onChange={(e) =>
                                                  setSelectedUser({
                                                    ...selectedUser,
                                                    firstName:
                                                      e.currentTarget.value,
                                                  })
                                                }
                                              />
                                            </div>

                                            <div>
                                              <Label>Cognome</Label>
                                              <Input
                                                type="text"
                                                value={selectedUser?.lastName}
                                                onChange={(e) =>
                                                  setSelectedUser({
                                                    ...selectedUser,
                                                    lastName:
                                                      e.currentTarget.value,
                                                  })
                                                }
                                              />
                                            </div>

                                            <div>
                                              <Label>E-mail</Label>
                                              <Input
                                                type="text"
                                                value={selectedUser?.email}
                                                onChange={(e) =>
                                                  setSelectedUser({
                                                    ...selectedUser,
                                                    email:
                                                      e.currentTarget.value,
                                                  })
                                                }
                                              />
                                            </div>

                                            <div>
                                              <Label>Ruolo</Label>
                                              <Input
                                                disabled
                                                type="text"
                                                value={selectedUser?.role}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                                          <Button
                                            variant="outline"
                                            onClick={() => setEditModal(false)}
                                          >
                                            Close
                                          </Button>
                                          <Button
                                            onClick={() => handleUpdate()}
                                          >
                                            Modifica
                                          </Button>
                                        </div>
                                      </div>{" "}
                                    </div>
                                  }
                                />
                                {userdata.username !== user.username && (
                                  <Tooltip title="Promuovi">
                                    <button
                                      onClick={() => {
                                        setPromoteModal(true);
                                        setSelectedUser(user);
                                      }}
                                      className="hover:text-blue-400 p-1 rounded active:scale-95"
                                    >
                                      <MovingIcon />
                                    </button>
                                  </Tooltip>
                                )}
                                <Modal
                                  isOpen={promoteModal}
                                  onClose={() => {
                                    setPromoteModal(false);
                                    setSelectedUser({});
                                  }}
                                  className="max-w-[700px] m-4"
                                  children={
                                    <div>
                                      {" "}
                                      <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                                        <div className="px-2 pr-14">
                                          <h4 className="mb-2 text-xl font-semibold py-2 text-gray-800 dark:text-white/90">
                                            Seleziona un nuovo ruolo per
                                            <span className="text-violet-400 capitalize">
                                              {" "}
                                              {selectedUser?.username}
                                            </span>
                                          </h4>
                                          <Select
                                            placeholder="Seleziona un nuovo ruolo"
                                            options={[
                                              {
                                                value: "admin",
                                                label: "Admin",
                                              },
                                              {
                                                value: "manager",
                                                label: "Manager",
                                              },
                                              {
                                                value: "viewer",
                                                label: "Visitatore",
                                              },
                                            ]}
                                            onChange={(e) => {
                                              setSelectedUser({
                                                ...selectedUser,
                                                role: e,
                                              });
                                            }}
                                          ></Select>
                                        </div>
                                        <form className="flex flex-col">
                                          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                                            <Button
                                              variant="outline"
                                              onClick={() =>
                                                setPromoteModal(false)
                                              }
                                            >
                                              Chiudi
                                            </Button>
                                            <Button
                                              onClick={() => handlePromotion()}
                                            >
                                              Conferma
                                            </Button>
                                          </div>
                                        </form>
                                      </div>
                                    </div>
                                  }
                                />
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <CustomPagination
                    handleChangePage={handleChangePage}
                    totalResults={totalResults ?? 0}
                    pageSize={pageSize}
                    currentPage={currentPage}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="flex w-full justify-center items-center h-150">
              <ReactLoader />
            </div>
          )}
        </>
      </>
    </>
  );
};
export default UsersTable;
