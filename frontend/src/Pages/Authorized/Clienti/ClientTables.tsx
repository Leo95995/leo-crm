// Redux stata management
import { useDispatch, useSelector } from "react-redux";
// Icons
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
// React states
import { useEffect, useState } from "react";
// Components
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/table";
import { Tooltip } from "@mui/material";
import Button from "../../../components/button/Button";
import Input from "../../../components/form/input/InputField";
import { Modal } from "../../../components/modal";
import Label from "../../../components/form/Label";
import { setGlobalLoad, setInternalLoad } from "../../../store/appStore";
import ReactLoader from "../../../components/Loader/Loader";

// User table configuration
import { contactInfo } from "../Utenti/userTableConfig";

// Api datas
import { ContactApi } from "../../../API/Contacts/contacts";
import EmptyList from "../../../components/empty/emptyList";
import CustomPagination from "../../../components/pagination/customPagination";
import { clientFilters } from "../../shared-datas/generic-datas";

// Icons
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface ICLientTable {
  allowedActions: string[];
  setCreateContactModal: (val: any) => any;
  optionsFilters: string;
  searchText: string;
  searchDrill: any;
  isWriting: boolean;
  [key: string]: any;
}

const ClientTable: React.FC<ICLientTable> = ({
  allowedActions,
  setCreateContactModal,
  optionsFilters,
  searchText,
  searchDrill,
  isWriting,
  errorMessage,
  setSuccessMessage,
  successMessage,
}) => {
  const [contactList, setContactList] = useState<any[]>();
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [selectedContact, setSelectedContact] = useState<any>();
  const dispatch = useDispatch();
  const internalLoad = useSelector((state: any) => state.app.internalLoad);
  const [sortOrder, setSortOrder] = useState<any>({ order: "", field: "" });

  /**PAGINATION */
  const pageSize = 10;
  const [totalResults, setTotalResults] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    if (
      searchText === "" ||
      (sortOrder.field && sortOrder.order && !isWriting)
    ) {
      let contactDatas = ContactApi.getContacts(
        1,
        searchText,
        getFilterVal(),
        getSortedVal()
      );
      dispatch(setInternalLoad(true));

      contactDatas.then((res) => {
        if (res?.data) {
          const { contacts, total } = res.data;
          setContactList(contacts);
          setTotalResults(total);
        } else {
          console.log(
            `Nessun contatto ricevuto dal cambio pagina ${currentPage}`
          );
        }
        setTimeout(() => {
          dispatch(setInternalLoad(false));
        }, 500);
      });
    }
  }, [totalResults, searchText, sortOrder]);

  useEffect(() => {
    handleSearch();
  }, [searchDrill]);

  const handleSearch = () => {
    ContactApi.getContacts(1, searchText, getFilterVal(), getSortedVal()).then(
      (res) => {
        setContactList(res?.data?.contacts);
        setTotalResults(res?.data?.total);
        setCurrentPage(1);
      }
    );
  };

  // Delete Contact

  const handleDelete = () => {
    ContactApi.deleteContact(selectedContact._id)
      .then((res) => {
        if (res) {
          setSuccessMessage("Contatto eliminato con successo");
          setTimeout(() => {
            setSuccessMessage("");
          }, 3000);
          ContactApi.getContacts().then((res) => {
            if (res?.data) {
              const { contacts } = res.data;
              setContactList(contacts);
            } else {
              setContactList([]);
            }
          });
        }
      })
      .catch((e) => console.log(e));
    dispatch(setInternalLoad(true));
    setTimeout(() => {
      dispatch(setInternalLoad(false));
    }, 500);
    setDeleteModal(false);
  };

  const handleUpdate = () => {
    const modifiedDatas = {
      name: selectedContact.name,
      email: selectedContact.email,
      phone: selectedContact.phone,
    };
    ContactApi.updateContact(selectedContact._id, modifiedDatas)
      .then(() => {
        setSuccessMessage("Contatto aggiornato con successo");
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
        dispatch(setGlobalLoad(true));
        setTimeout(() => {
          dispatch(setGlobalLoad(false));
        }, 500);
      })
      .catch((e) => console.log(e));
    setEditModal(false);
  };

  const getFilterVal = () => {
    const selected_value_filter = clientFilters.find(
      (filter) => filter.label === optionsFilters
    )?.value;
    return selected_value_filter;
  };

  const getSortedVal = () => {
    const selected_value_filter = clientFilters.find(
      (filter) => filter.label === sortOrder?.field
    )?.value;

    const toRet = {
      order: sortOrder.order,
      field: selected_value_filter as string,
    };

    return toRet;
  };

  // Questa deve essere passata dal componente sopra a qui sotto

  /**
   * Gestione del cambio pagina
   */
  const handleChangePage = (pageNumber: number) => {
    ContactApi.getContacts(
      pageNumber,
      searchText,
      getFilterVal(),
      getSortedVal()
    ).then((res) => {
      setCurrentPage(pageNumber);
      setContactList(res?.data?.contacts);
      setTotalResults(res?.data?.total);
    });
    setTimeout(() => {
      scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, 200);
  };

  return (
    <>
      {!internalLoad && (
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
          <div className="py-3 dark:text-white">
            Risultati totali <b> {totalResults}</b>
          </div>
          {contactList?.length ? (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
              <div className="max-w-full overflow-x-auto min-h-150">
                <Table>
                  <TableHeader
                    className={`border-b border-gray-100 dark:border-white/[0.05] `}
                  >
                    <TableRow>
                      {contactInfo.map((datum) => {
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
                                  className="border-2 cursor-pointer"
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
                    {contactList?.map((contact) => (
                      <TableRow key={contact.name}>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 overflow-hidden rounded-full dark:bg-red-200 bg-violet-300 justify-center flex items-center">
                              <span className=" uppercase">
                                {contact?.name?.split("")[0]}
                              </span>
                            </div>
                            <div>
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                {contact.name}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {contact.email}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          {contact.phone}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          {contact.user_id?.username}
                        </TableCell>
                        {allowedActions.includes("update") && (
                          <TableCell className="px-4 py-3  text-gray-500 text-theme-sm w-32 dark:text-gray-400">
                            {allowedActions.includes("delete") && (
                              <Tooltip title="Elimina">
                                <button
                                  className="hover:text-red-400 active:scale-95"
                                  onClick={() => {
                                    setDeleteModal(true);
                                    setSelectedContact(contact);
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
                                        Sei sicuro di voler eliminare il
                                        cliente?
                                      </h4>
                                      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                                        Se confermi il cliente verrà cancellato
                                        per sempre
                                      </p>
                                    </div>
                                    <form className="flex flex-col">
                                      <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                                        <Button
                                          variant="outline"
                                          onClick={() => setDeleteModal(false)}
                                        >
                                          Chiudi
                                        </Button>
                                        <Button onClick={handleDelete}>
                                          Elimina
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
                                  setSelectedContact(contact);
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
                                        Modifica Contatto
                                      </h4>
                                      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                                        Modifica i dettagli del contatto{" "}
                                        <b>{selectedContact?.name}</b>
                                      </p>
                                    </div>
                                    <div className="px-2 overflow-y-auto custom-scrollbar">
                                      <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                                        <div>
                                          <Label>Nome</Label>
                                          <Input
                                            type="text"
                                            value={selectedContact?.name}
                                            onChange={(e) =>
                                              setSelectedContact({
                                                ...selectedContact,
                                                name: e.currentTarget.value,
                                              })
                                            }
                                          />
                                        </div>

                                        <div>
                                          <Label>Numero di telefono</Label>
                                          <Input
                                            type="text"
                                            value={selectedContact?.phone}
                                            onChange={(e) =>
                                              setSelectedContact({
                                                ...selectedContact,
                                                phone: e.currentTarget.value,
                                              })
                                            }
                                          />
                                        </div>

                                        <div>
                                          <Label>E-mail</Label>
                                          <Input
                                            type="email"
                                            value={selectedContact?.email}
                                            onChange={(e) =>
                                              setSelectedContact({
                                                ...selectedContact,
                                                email: e.currentTarget.value,
                                              })
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                                      <Button
                                        variant="outline"
                                        onClick={() => setEditModal(false)}
                                      >
                                        Chiudi
                                      </Button>
                                      <Button onClick={() => handleUpdate()}>
                                        Modifica
                                      </Button>
                                    </div>
                                  </div>{" "}
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
                currentPage={currentPage}
                totalResults={totalResults}
                pageSize={pageSize}
                handleChangePage={handleChangePage}
              />
            </div>
          ) : (
            <>
              {!internalLoad && (
                <>
                  {searchText ? (
                    <EmptyList
                      icon={<PersonIcon style={{ fontSize: "40px" }} />}
                      mainText={`Nessun opportunità trovata`}
                      secondaryText={`con il ${optionsFilters} ${searchText}`}
                    />
                  ) : (
                    <EmptyList
                      icon={
                        <PersonIcon
                          className="text-2xl"
                          style={{ fontSize: "40px" }}
                        />
                      }
                      mainText={`Nessun contatto presente`}
                      secondaryText={`Aggiungine uno per iniziare`}
                      onClick={() => setCreateContactModal(true)}
                    />
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
      {internalLoad && (
        <div className="flex w-full justify-center items-center h-150">
          <ReactLoader />
        </div>
      )}
    </>
  );
};
export default ClientTable;
