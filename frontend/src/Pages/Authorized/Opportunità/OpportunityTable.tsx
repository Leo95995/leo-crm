import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/table";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../components/button/Button";

import Input from "../../../components/form/input/InputField";

import { Modal } from "../../../components/modal";
import Label from "../../../components/form/Label";
import { setInternalLoad } from "../../../store/appStore";
import ReactLoader from "../../../components/Loader/Loader";

//   Opportunity Datas
import { OpportunityInfo } from "../Utenti/userTableConfig";
import { OpportunityAPI } from "../../../API/Opportunities/Opportunities";
import Badge from "../../../components/badge/Badge";
import Select from "../../../components/form/Select";
import CustomDateInput from "../../../components/datepicker/customDatePicker";
import { API_Activity } from "../../../API/ActivityApis/activities";
import { toast, ToastContainer } from "react-toastify";
import { IActivity } from "../../../interfaces/opportunities";
import ConfirmModal from "../../../components/confirm-modal/ConfirmModal";
import { opportunityOptions } from "../../../Utils/options";
import { Link } from "react-router";
import EmptyList from "../../../components/empty/emptyList";
import CustomPagination from "../../../components/pagination/customPagination";
import { opportunityFilters } from "../../shared-datas/generic-datas";
// Icons
import ClearIcon from "@mui/icons-material/Clear";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SelectAutocomplete from "../../../components/form/SelectAutoComplete";

interface IOpportunityTable {
  allowedActions: string[];
  infoList: { contacts: any[]; users: any[] };
  setContactModal: (val: boolean) => any;
  optionsFilters: string;
  searchText: string;
  searchDrill: boolean;
  isWriting: boolean;
  [key: string]: any;
}

const OpportunityTable: React.FC<IOpportunityTable> = ({
  allowedActions,
  infoList,
  setContactModal,
  optionsFilters,
  searchText,
  searchDrill,
  isWriting,
  successMessage,
  errorMessage,
  setSuccessMessage,
  setErrorMessage,
}) => {
  const [opportunityList, setOpportunityList] = useState<any[]>();
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>({});
  // Activities Data
  const [modifyActivity, setModifyActivity] = useState<boolean>(false);
  const [selectedActivity, setSelectedActivity] = useState<any>({});
  const [activitiesModal, setActivitiesModal] = useState<boolean>(false);
  const [createActivityModal, setCreateActivityModal] =
    useState<boolean>(false);
  const [activityToCreate, setActivityToCreate] = useState<any>({});
  const dispatch = useDispatch();
  const internalLoad = useSelector((state: any) => state.app.internalLoad);
  // Risultati totali
  const [totalResults, setTotalResults] = useState<number>(0);
  //Pagina corrente
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortOrder, setSortOrder] = useState<any>({ order: "", field: "" });

  // Pagesize
  const pageSize = 10;
  // Users total

  const getSortedVal = () => {
    const selected_value_filter = opportunityFilters.find(
      (filter) => filter.label === sortOrder?.field
    )?.value;

    const toRet = {
      order: sortOrder.order,
      field: selected_value_filter as string,
    };

    return toRet;
  };

  const getFilterVal = () => {
    const selected_value_filter = opportunityFilters.find(
      (filter) => filter.label === optionsFilters
    )?.value;
    return selected_value_filter;
  };

  useEffect(() => {
    if (sessionStorage) {
      const opportunityId = sessionStorage.getItem("selectedOpportunity");
      if (opportunityId?.length) {
        const selected = opportunityList?.find(
          (opp) => opp._id === opportunityId
        );

        if (selected !== undefined) {
          setSelectedOpportunity(selected);
          setActivitiesModal(true);
        }
        setTimeout(() => {
          sessionStorage.removeItem("selectedOpportunity");
        }, 500);
      }
    }
  }, [opportunityList, sessionStorage]);

  useEffect(() => {
    if (
      searchText === "" ||
      (sortOrder.field && sortOrder.order && !isWriting)
    ) {
      dispatch(setInternalLoad(true));
      let opportunityData = OpportunityAPI.getOpportunities(
        1,
        searchText,
        getFilterVal(),
        getSortedVal()
      );
      opportunityData.then((res) => {
        if (res?.data) {
          const { opportunities, total } = res.data;
          setOpportunityList(opportunities);
          setTotalResults(total);
          setTimeout(() => {
            dispatch(setInternalLoad(false));
          }, 250);
        } else {
          console.log(
            `Im unable to fetch opportunities right now ${currentPage}`
          );
          setTimeout(() => {
            dispatch(setInternalLoad(false));
          }, 250);
        }
      });
    }
  }, [totalResults, searchText, sortOrder]);

  useEffect(() => {
    if (selectedOpportunity?._id) {
      let opportunityId = selectedOpportunity?._id;
      let res = opportunityList?.find(
        (select) => select?._id === opportunityId
      );
      setSelectedOpportunity(res);
    }
  }, [opportunityList]);

  useEffect(() => {
    handleSearch();
  }, [searchDrill]);

  const handleSearch = () => {
    OpportunityAPI.getOpportunities(1, searchText, getFilterVal()).then(
      (res) => {
        setOpportunityList(res?.data?.opportunities);
        setTotalResults(res?.data?.total);
        setCurrentPage(1);
      }
    );
  };

  /**
   * Gestione del cambio pagina
   */
  const handleChangePage = (pageNumber: number) => {
    OpportunityAPI.getOpportunities(
      pageNumber,
      searchText,
      getFilterVal()
    ).then((res: any) => {
      setCurrentPage(pageNumber);
      setOpportunityList(res?.data?.opportunities);
      setTotalResults(res?.data?.total);
    });
    setTimeout(() => {
      scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, 200);
  };

  const handleDelete = () => {
    OpportunityAPI.deleteOpportunity(selectedOpportunity._id)
      .then((res) => {
        if (res) {
          setSuccessMessage("Opportunità eliminata con successo");
          setTimeout(() => {
            setSuccessMessage("");
          }, 3000);
          OpportunityAPI.getOpportunities(currentPage).then((res) => {
            if (res?.data) {
              const { opportunities } = res.data;
              setOpportunityList(opportunities);
            } else {
              setOpportunityList([]);
            }
          });
        }else {
           setErrorMessage("Errore nell'eliminazione");
          setTimeout(() => {
            setErrorMessage("");
          }, 3000);
        }
      })
      .catch((e) => console.log(e));
    dispatch(setInternalLoad(true));
    setTimeout(() => {
      dispatch(setInternalLoad(false));
    }, 500);
    setDeleteModal(false);
  };

  const getOpportunityBadgeState = (val: string) => {
    if (!val) {
      return "primary";
    }
    switch (val) {
      case "nuova":
        return "primary";
      case "in corso":
        return "warning";
      case "vinta":
        return "success";
      case "persa":
        return "error";
      default:
        return "primary";
    }
  };

  const getActivityBadgeState = (val: string) => {
    switch (val) {
      case "In corso":
        return "warning";
      case "Completata":
        return "success";
      case "Pianificata":
        return "primary";
      case "In attesa":
        return "primary";
      default:
        return "primary";
    }
  };

  // Funzione per modifica della opportunità con nuovi dati inseriti

  const handleUpdate = () => {
    const modifiedDatas = {
      ...selectedOpportunity,
      name: selectedOpportunity?.name,
      value: selectedOpportunity?.value,
      stage: selectedOpportunity?.stage,
      contact_id: selectedOpportunity?.contact_id,
      user_id: selectedOpportunity?.user_id,
    };

    OpportunityAPI.updateOpportunity(selectedOpportunity?._id, modifiedDatas)
      .then(() => {
        setSuccessMessage("Opportunità Modificata con successo");
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
        dispatch(setInternalLoad(true));

        setTimeout(() => {
          dispatch(setInternalLoad(false));
        }, 500);
      })
      .catch((e) => console.log(e));
    setEditModal(false);
  };

  // ---------------- ATTIVITA --------------------
  const handleActivityModification = () => {
    API_Activity.updateActivityFromOpportunity(
      selectedOpportunity?._id,
      selectedActivity?._id,
      selectedActivity
    ).then(() => {
      setActivitiesModal(false);

      OpportunityAPI.getOpportunities(currentPage).then((res) => {
        setOpportunityList(res?.data?.opportunities);
        dispatch(setInternalLoad(true));
        setTimeout(() => {
          setSuccessMessage("Attivita Modificata con successo");
          setTimeout(() => setSuccessMessage(""), 3000);
          dispatch(setInternalLoad(false));
        }, 400);
      });
    });
  };

  const handleCreateActivity = () => {
    API_Activity.addActivityToOpportunity(
      selectedOpportunity._id,
      activityToCreate
    )
      .then((res) => {
        if (res?.code === 201) {
          setCreateActivityModal(false);

          OpportunityAPI.getOpportunities(currentPage).then((res) => {
            setOpportunityList(res?.data?.opportunities);
            setSuccessMessage("Attività Creata con successo");
            setTimeout(() => setSuccessMessage(""), 3000);
          });
        } else {
          setErrorMessage("Errore nella creazione dell'attività");
          setTimeout(() => setErrorMessage(""), 3000);
        }
      })
      .catch((e) => console.log(e));
  };

  const handleDeleteActivity = (selectedActivity: IActivity) => {
    API_Activity.deleteActivityFromOpportunity(
      selectedOpportunity._id,
      selectedActivity._id
    )
      .then((res) => {
        if (res?.data) {
          setActivitiesModal(false);
          setSuccessMessage("Attivita Eliminata con successo");
          setTimeout(() => setSuccessMessage(""), 3000);
          OpportunityAPI.getOpportunities(currentPage).then((res) => {
            setOpportunityList(res?.data?.opportunities);
          });
        } else {
          toast.error("err");
        }
      })
      .catch((e) => console.log(e));
  };

  const renderDeleteChildren = (
    action: (val?: any) => any,
    failAction: (val?: any) => any
  ) => {
    return (
      <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 dark:text-white lg:p-11">
        <div className="flex flex-col gap-3 py-3 px-3">
          <h2 className="text-xl font-bold">Sei sicuro?</h2>
          <p className="text-lg">
            Se confermi eliminerai per sempre l'attività selezionata{" "}
            <b className="text-violet-500">{selectedActivity?.description}</b>
          </p>
          <div className="flex gap-3 items-center">
            <Button size="sm" onClick={() => action()}>
              Conferma
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="hover:bg-gray-300"
              onClick={() => failAction()}
            >
              Annulla
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderDeleteButton = (selectedActivity: any) => {
    return (
      <button
        onClick={() =>
          allowedActions.includes("delete") &&
          setSelectedActivity(selectedActivity)
        }
        className="border-2 flex-1 flex px-2 justify-center py-1 rounded-sm hover:opacity-90 border-2 text-white border-red-400 bg-red-400  hover:bg-red-400 hover:border-red-400 hover:text-white"
      >
        Elimina
      </button>
    );
  };

  const renderContactCell = (opportunity: any) => {
    if (opportunity?.contact_id?.name) {
      return opportunity?.contact_id?.name;
    }

    if (infoList.contacts.length > 0) {
      return (
        <Button
          size="sm"
          onClick={() => {
            if (allowedActions.includes("update")) {
              setSelectedOpportunity(opportunity);
              setEditModal(true);
            } else {
              toast.error(
                "Non hai i permessi per assegnare contatti alle opportunità"
              );
            }
          }}
        >
          Assegna contatto
        </Button>
      );
    } else {
      return (
        <div className="flex flex-col w-fit">
          {" "}
          <Link
            className="p-3 bg-violet-500 text-center rounded-lg text-white "
            to={`/clienti`}
          >
            {" "}
            Creane uno
          </Link>
        </div>
      );
    }
  };

  return (
    <>
      <p className="dark:text-white py-3">
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
        Risultati totali{""} <b> {totalResults}</b>
      </p>
      {!internalLoad ? (
        <>
          {opportunityList?.length ? (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
              <div className="max-w-full overflow-x-auto  sm:min-h-150">
                <Table>
                  <TableHeader
                    className={`border-b border-gray-100 dark:border-white/[0.05] `}
                  >
                    <TableRow>
                      {OpportunityInfo.map((datum) => {
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
                                  if (
                                    datum !== "Azioni" &&
                                    datum !== "Attività" &&
                                    datum !== "Contatto" &&
                                    datum !== "Assegnata a"
                                  ) {
                                    sortOrder?.order === "ASC"
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
                                  sortOrder?.order === "ASC" ? (
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
                                    {datum !== "Azioni" &&
                                      datum !== "Attività" &&
                                      datum !== "Contatto" &&
                                      datum !== "Assegnata a" && (
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
                                    className="hover:bg-gray-400 p-1 rounded-full hover:text-black flex items-center justify-center "
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
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {opportunityList?.map((opportunity) => (
                      <TableRow key={opportunity?.name}>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          <div className="flex items-center gap-3">
                            <div>
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                {opportunity?.name}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {opportunity?.value?.toFixed(2)} €
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          <Badge
                            color={getOpportunityBadgeState(opportunity?.stage)}
                          >
                            <span className="capitalize">
                              {opportunity.stage}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          {renderContactCell(opportunity)}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          {opportunity?.user_id?.username ?? (
                            <Button
                              size="sm"
                              onClick={() => {
                                if (allowedActions.includes("update")) {
                                  setSelectedOpportunity(opportunity);
                                  setEditModal(true);
                                } else {
                                  toast.error(
                                    "Non hai i permessi per assegnare utenti alle opportunità"
                                  );
                                }
                              }}
                            >
                              Assegna utente
                            </Button>
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          <Modal
                            isOpen={createActivityModal}
                            onClose={() => {
                              setCreateActivityModal(false);
                              setSelectedOpportunity({});
                              setActivityToCreate({});
                            }}
                            className="max-w-[900px] m-4"
                            children={
                              <div className="relative w-full z-999 p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 dark:text-white lg:p-11">
                                <div className="px-2 pr-14">
                                  <h2 className="text-3xl">
                                    Creazione Attività - per opportunità{" "}
                                    <b className="text-violet-400">
                                      {selectedOpportunity?.name}
                                    </b>
                                  </h2>

                                  <div className="px-2 overflow-y-auto custom-scrollbar">
                                    <div className="grid py-4 grid-cols-1 gap-x-6 gap-y-12 lg:grid-cols-1">
                                      <div className="flex flex-col gap-6">
                                        <div>
                                          <Label>Descrizione</Label>
                                          <Input
                                            placeholder="Inserisci descrizione"
                                            className="capitalize"
                                            onChange={(e) => {
                                              setActivityToCreate({
                                                ...activityToCreate,
                                                description:
                                                  e.currentTarget.value,
                                              });
                                            }}
                                          />
                                        </div>
                                        <div>
                                          <Label>Stato</Label>
                                          <Select
                                            placeholder="Seleziona uno stato"
                                            className="capitalize"
                                            options={[
                                              {
                                                value: "In corso",
                                                label: "In corso",
                                              },
                                              {
                                                value: "Completata",
                                                label: "Completata",
                                              },
                                              {
                                                value: "Pianificata",
                                                label: "Pianificata",
                                              },
                                              {
                                                value: "In attesa",
                                                label: "In attesa",
                                              },
                                            ]}
                                            onChange={(e) => {
                                              setActivityToCreate({
                                                ...activityToCreate,
                                                status: String(e),
                                              });
                                            }}
                                          />
                                        </div>
                                        <div>
                                          <Label>Data</Label>
                                          <CustomDateInput
                                            onClick={(e) => {
                                              setActivityToCreate({
                                                ...activityToCreate,
                                                date: e as string,
                                              });
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex gap-2 my-2">
                                    <Button
                                      variant="outline"
                                      className="my-2"
                                      onClick={() => {
                                        setCreateActivityModal(false);
                                        if (
                                          selectedOpportunity?.activities
                                            ?.length
                                        ) {
                                          setActivitiesModal(true);
                                        }

                                        setCreateActivityModal(false);
                                        setActivityToCreate({});
                                      }}
                                    >
                                      Chiudi
                                    </Button>
                                    <Button
                                      className="my-2"
                                      onClick={handleCreateActivity}
                                    >
                                      Crea
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            }
                          />
                          {opportunity?.activities?.length < 1 ? (
                            <>
                              <div className="flex gap-3 flex-col w-27">
                                <div>Nessun attività</div>{" "}
                                <Button
                                  onClick={() => {
                                    setCreateActivityModal(true);
                                    setSelectedOpportunity(opportunity);
                                    setActivityToCreate({});
                                  }}
                                  size="sm"
                                >
                                  +
                                </Button>
                              </div>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setActivitiesModal(true);
                                  setSelectedOpportunity(opportunity);
                                  setActivityToCreate({});
                                }}
                              >
                                Lista attività
                              </Button>
                            </>
                          )}
                          <Modal
                            isOpen={activitiesModal}
                            onClose={() => {
                              setActivitiesModal(false);
                              setModifyActivity(false);
                              setSelectedActivity({});
                              setActivityToCreate({});
                            }}
                            className="max-w-[900px] m-4"
                            children={
                              <div>
                                {" "}
                                <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 dark:text-white lg:p-11">
                                  <div className="px-2 pr-14">
                                    <ToastContainer
                                      className={`z-999999`}
                                      position="bottom-right"
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
                                    <h2 className="text-3xl">
                                      Lista attivita - Opportunità{" "}
                                      <b className="text-violet-500">
                                        {selectedOpportunity?.name}
                                      </b>
                                    </h2>
                                    <Button
                                      onClick={() => {
                                        if (allowedActions.includes("create")) {
                                          setActivitiesModal(false);
                                          setCreateActivityModal(true);
                                        } else {
                                          toast.error(
                                            "non hai i permessi per effettuare questa azione"
                                          );
                                        }
                                      }}
                                      size="sm"
                                      className="my-4"
                                    >
                                      Aggiungi Attività
                                    </Button>
                                    {selectedOpportunity?.activities?.map(
                                      (e: any, index: number) => {
                                        return (
                                          <div key={index} className="my-2">
                                            <div
                                              className={`flex text-gray-600 ${
                                                selectedActivity._id === e._id
                                                  ? `bg-blue-100`
                                                  : "bg-white"
                                              } bg-violet-200 shadow-2xs border-2 rounded-md hover:bg-gray-100`}
                                            >
                                              <div className="flex-1  flex flex-col">
                                                <b className=" bg-gray-200 p-1">
                                                  Nome
                                                </b>
                                                <b className="p-3">
                                                  {e.description}
                                                </b>
                                              </div>
                                              <div className="flex-1  flex flex-col">
                                                <b className=" bg-gray-200 p-1">
                                                  Data
                                                </b>
                                                <b className="p-3">
                                                  {e.date.split("T")[0]}
                                                </b>
                                              </div>
                                              <div className="flex-1 flex flex-col">
                                                <b className=" bg-gray-200 p-1">
                                                  Stato
                                                </b>
                                                <b className="p-3">
                                                  <Badge
                                                    color={getActivityBadgeState(
                                                      e.status
                                                    )}
                                                  >
                                                    <span className="capitalize">
                                                      {" "}
                                                      {e.status}
                                                    </span>
                                                  </Badge>
                                                </b>
                                              </div>
                                              <div className="flex-1 flex flex-col">
                                                <b className=" bg-gray-200 p-1">
                                                  Azioni
                                                </b>
                                                <div className="flex flex-wrap  p-2 gap-2 ">
                                                  <ConfirmModal
                                                    childrenAction={() => {
                                                      handleDeleteActivity(e);
                                                    }}
                                                    children={
                                                      renderDeleteChildren
                                                    }
                                                    triggerButton={renderDeleteButton(
                                                      e
                                                    )}
                                                    permission={allowedActions.includes(
                                                      "delete"
                                                    )}
                                                  />
                                                  <button
                                                    className={`px-2 w-24 border-2 p-1 flex-1 flex justify-center rounded-sm hover:opacity-90 ${
                                                      selectedActivity._id ===
                                                        e._id &&
                                                      `bg-violet-500 border-violet-500 text-white`
                                                    } hover:bg-violet-500 hover:border-violet-500  hover:text-white`}
                                                    onClick={() => {
                                                      if (
                                                        allowedActions.includes(
                                                          "delete"
                                                        )
                                                      ) {
                                                        if (
                                                          selectedActivity._id ===
                                                          e._id
                                                        ) {
                                                          setSelectedActivity(
                                                            {}
                                                          );
                                                          setModifyActivity(
                                                            false
                                                          );
                                                        } else {
                                                          setSelectedActivity(
                                                            e
                                                          );
                                                          setModifyActivity(
                                                            true
                                                          );
                                                        }
                                                      } else {
                                                        toast.error(
                                                          "non hai i permessi per effetturare questa azione"
                                                        );
                                                      }
                                                    }}
                                                  >
                                                    {selectedActivity._id ===
                                                    e._id
                                                      ? "Selezionato"
                                                      : "Modifica"}
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      }
                                    )}
                                    {modifyActivity && (
                                      <div>
                                        <h2 className="text-3xl text-gray-500 dark:text-white py-2">
                                          Modifica attivita
                                        </h2>
                                        <Label>Nome</Label>
                                        <Input
                                          value={selectedActivity?.description}
                                          onChange={(e) =>
                                            setSelectedActivity({
                                              ...selectedActivity,
                                              description:
                                                e.currentTarget.value,
                                            })
                                          }
                                        />
                                        <Label>Data</Label>
                                        <CustomDateInput
                                          onClick={(e) => {
                                            setSelectedActivity({
                                              ...selectedActivity,
                                              date: e as string,
                                            });
                                          }}
                                        />
                                        <Label>Stato</Label>
                                        <Select
                                          staticVal={selectedActivity?.status}
                                          defaultValue={
                                            selectedActivity?.status
                                          }
                                          placeholder={
                                            "Seleziona un nuovo stato"
                                          }
                                          options={[
                                            {
                                              value: "In corso",
                                              label: "In corso",
                                            },
                                            {
                                              value: "Completata",
                                              label: "Completata",
                                            },
                                            {
                                              value: "Pianificata",
                                              label: "Pianificata",
                                            },
                                            {
                                              value: "In attesa",
                                              label: "In attesa",
                                            },
                                          ]}
                                          onChange={(e) => {
                                            setSelectedActivity({
                                              ...selectedActivity,
                                              status: e,
                                            });
                                          }}
                                        ></Select>
                                        <div className="flex gap-2 my-2">
                                          <Button
                                            variant="outline"
                                            className="my-2"
                                            onClick={() => {
                                              setModifyActivity(false);
                                              setSelectedActivity({});
                                            }}
                                          >
                                            Chiudi
                                          </Button>
                                          <Button
                                            className="my-2"
                                            onClick={handleActivityModification}
                                          >
                                            Salva Modifiche
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            }
                          />
                        </TableCell>
                        {allowedActions.includes("update") && (
                          <TableCell className="px-4 py-3  text-gray-500 text-theme-sm w-32 dark:text-gray-400">
                            {allowedActions.includes("delete") && (
                              <Tooltip title="Elimina">
                                <button
                                  className="hover:text-red-400 active:scale-95"
                                  onClick={() => {
                                    setSelectedOpportunity(opportunity);
                                    setDeleteModal(true);
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
                                  <ToastContainer
                                    className={`z-999999`}
                                    position="bottom-right"
                                    autoClose={3000}
                                    hideProgressBar={false}
                                    newestOnTop={false}
                                    closeOnClick={false}
                                    rtl={false}
                                    pauseOnFocusLoss
                                    draggable
                                    pauseOnHover
                                    theme="light"
                                  />{" "}
                                  <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 dark:text-white lg:p-11">
                                    <div className="px-2 pr-14">
                                      <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                                        Sei sicuro?{" "}
                                      </h4>
                                      <p className="text-lg">
                                        {" "}
                                        Se confermi l'opportunità{" "}
                                        <b className="text-violet-300">
                                          {selectedOpportunity?.name}
                                        </b>{" "}
                                        verrà eliminata per sempre
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
                                  setSelectedOpportunity(opportunity);
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
                                  <ToastContainer
                                    className={`z-999999`}
                                    position="bottom-right"
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
                                  <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl  dark:bg-gray-900 lg:p-11">
                                    <div className="px-2 pr-14">
                                      <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                                        Modifica Opportunità
                                        <b> {selectedOpportunity?.name}</b>
                                      </h4>
                                      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                                        Modifica i dettagli dell'opportunità{" "}
                                      </p>
                                    </div>
                                    <div className="px-2 overflow-y-auto custom-scrollbar">
                                      <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                                        <div>
                                          <Label>Nome Opportunità</Label>
                                          <Input
                                            type="text"
                                            value={selectedOpportunity?.name}
                                            onChange={(e) =>
                                              setSelectedOpportunity({
                                                ...selectedOpportunity,
                                                name: e.currentTarget.value,
                                              })
                                            }
                                          />
                                        </div>

                                        <div>
                                          <Label> Valore ( € )</Label>
                                          <Input
                                            type="number"
                                            value={selectedOpportunity?.value}
                                            onChange={(e) =>
                                              setSelectedOpportunity({
                                                ...selectedOpportunity,
                                                value: e.currentTarget.value,
                                              })
                                            }
                                          />
                                        </div>

                                        <div>
                                          <Label>Stato</Label>
                                          <Select
                                            placeholder="Seleziona uno stato"
                                            className="capitalize"
                                            staticVal={
                                              selectedOpportunity?.stage
                                            }
                                            options={opportunityOptions}
                                            onChange={(e) => {
                                              setSelectedOpportunity({
                                                ...selectedOpportunity,
                                                stage: String(e),
                                              });
                                            }}
                                          />
                                        </div>
                                        <div>
                                          <Label>Contatto</Label>
                                          <SelectAutocomplete
                                            options={infoList?.contacts}
                                            placeholder="Seleziona un contatto"
                                            onChange={(e) => {
                                              setSelectedOpportunity({
                                                ...selectedOpportunity,
                                                contact_id: String(e),
                                              });
                                            }}
                                          />
                                        </div>
                                        <div>
                                          <Label>Assegnato a </Label>
                                          <SelectAutocomplete
                                            options={infoList?.users}
                                            placeholder="Seleziona l'utente assegnato"
                                            onChange={(e) =>
                                              setSelectedOpportunity({
                                                ...selectedOpportunity,
                                                user_id: String(e),
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
              {searchText ? (
                <>
                  <EmptyList
                    icon={<MonetizationOnIcon style={{ fontSize: "40px" }} />}
                    mainText={`Nessun opportunità trovata`}
                    secondaryText={`con il ${optionsFilters} ${searchText}`}
                  />{" "}
                </>
              ) : (
                <EmptyList
                  icon={<MonetizationOnIcon style={{ fontSize: "40px" }} />}
                  mainText={`Nessun opportunità presente`}
                  secondaryText={`Aggiungine una`}
                  onClick={() => setContactModal(true)}
                />
              )}
            </>
          )}
        </>
      ) : (
        <div className="flex w-full justify-center items-center h-150">
          <ReactLoader />
        </div>
      )}
    </>
  );
};
export default OpportunityTable;
