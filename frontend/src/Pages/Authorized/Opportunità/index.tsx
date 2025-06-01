import { useDispatch, useSelector } from "react-redux";
import { IPage } from "../../../interfaces/pages";
import OpportunityTable from "./OpportunityTable";
import { useEffect, useState } from "react";
import { IOpportunity } from "../../../interfaces/opportunities";
import { setInternalLoad } from "../../../store/appStore";
import { OpportunityAPI } from "../../../API/Opportunities/Opportunities";
import Button from "../../../components/button/Button";
import { Modal } from "../../../components/modal";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Select from "../../../components/form/Select";
import { UsersAPI } from "../../../API/User/users";
import { ContactApi } from "../../../API/Contacts/contacts";
import { useNavigate } from "react-router";
import SearchIcon from "@mui/icons-material/Search";
// Interfaces
import { opportunityFilters } from "../../shared-datas/generic-datas";
import { toast } from "react-toastify";
import PageMeta from "../../../components/common/PageMeta";
import SelectAutocomplete from "../../../components/form/SelectAutoComplete";

const Opportunita: React.FC<IPage> = ({ userRole }) => {
  const [contactModal, setContactModal] = useState<boolean>(false);
  const userdata = useSelector((state: any) => state.app.userdata);
  const [isWriting, setIsWriting] = useState<boolean>(false);
  const [opportunityToCreate, setOpportunityToCreate] = useState<IOpportunity>({
    name: "",
    value: 0,
    stage: "nuova",
    contact_id: "",
    user_id: userdata._id,
  });

  const [optionFilters, setOptionFilters] = useState<string>();
  const [contactList, setContactList] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [allowedActions, setAllowedActions] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const dispatch = useDispatch();
  const [infoList, setInfoList] = useState<{ contacts: any[]; users: any[] }>({
    contacts: [],
    users: [],
  });
  const [searchText, setSearchText] = useState<string>("");

  /**
   * Controlla il sessionstorage per capire se arrivo da un altra sezione
   */

  useEffect(() => {
    if (sessionStorage.createContact) {
      sessionStorage.removeItem("createContact");
    }

    // Prepara i dati delle liste da visualizzare
    setInfoList({
      users: prepareUserOptions(),
      contacts: prepareContactOptions(),
    });
  }, [usersList, contactList]);
  const [searchDrill, setSearchDrill] = useState<boolean>(false);

  useEffect(() => {
    getUsersAndContacts();
    if (userRole) {
      setAllowedActions(userRole?.permissions);
    }

    handleFilterSelection();
  }, [userRole]);
  const navigate = useNavigate();

  const handleFilterSelection = (value?: any) => {
    const selected_filter = opportunityFilters.find(
      (filter) => filter.value === (value ? value : "name")
    );
    setOptionFilters(selected_filter?.label as string);
  };

  const prepareUserOptions = () => {
    if (!usersList) {
      return [];
    }
    const options = [...usersList]?.map((user: { _id: any; username: any }) => {
      return { value: user._id, label: user.username };
    });
    return options;
  };

  const prepareContactOptions = () => {
    if (!contactList) {
      return [];
    }
    const options = [...contactList]?.map((client: { _id: any; name: any }) => {
      return { value: client._id, label: client.name };
    });
    return options;
  };

  const getUsersAndContacts = () => {
    UsersAPI.getCompleteUserList()
      .then((res) => {
        setUsersList(res?.data.users);
      })
      .catch((err) => console.log(err));
    ContactApi.getCompleteContactList()
      .then((res) => {
        setContactList(res?.data.contacts);
      })
      .catch((e) => console.log(e));
  };

  // Creazione
  const handleCreateOpportunity = () => {
    OpportunityAPI.createOpportunity(opportunityToCreate)
      .then((res) => {
        if (res?.status) {
            setSuccessMessage("Attivita Modificata con successo");
          setTimeout(() => setSuccessMessage(""), 3000);
          dispatch(setInternalLoad(true));
          setTimeout(() => {
            dispatch(setInternalLoad(false));
          }, 500);
          setContactModal(false);
        }else {
          setErrorMessage("Errore nella creazione dell'attività");
          setTimeout(() => setErrorMessage(""), 3000);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <PageMeta
        title="LEO CRM | Opportunità "
        description="LEO CRM Pagina opportunità"
      />
      <div className="flex gap-5 my-6 flex-col md:flex-row md:items-center">
        <div>
          <Select
            options={opportunityFilters}
            onChange={handleFilterSelection}
            placeholder="Ricerca per"
            staticVal="name"
          />
        </div>
        <div className="flex">
          <Input
            type="text"
            disabled={!optionFilters}
            customStyle={{ margin: 0 }}
            onChange={(e) => {
              setIsWriting(true);
              setSearchText(e.currentTarget.value);
              setTimeout(() => {
                setIsWriting(false);
              }, 1000);
            }}
            onKeyPress={() => setSearchDrill((prev: boolean) => !prev)}
            placeholder={`${
              optionFilters
                ? `Ricerca  per ${optionFilters}`
                : "Seleziona un criterio di ricerca"
            }`}
          />
          <Button
            onClick={() => setSearchDrill((prev) => !prev)}
            size="sm"
            className="h-11"
          >
            <div className="visible md:collapse">Cerca</div>{" "}
            <SearchIcon style={{ fontSize: "18px" }} className="text-lg" />
          </Button>
        </div>
        <Button
          size="sm"
          className="my-4"
          onClick={() => {
            if (allowedActions.includes("create")) {
              setContactModal(true);
            } else {
              toast.error("Non hai i permessi per creare opportunità");
            }
          }}
        >
          Crea Opportunità
        </Button>
        <Modal
          isOpen={contactModal}
          onClose={() => setContactModal(false)}
          className="max-w-[700px] m-4"
          children={
            <div>
              <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl  dark:bg-gray-900 lg:p-11">
                <div className="px-2 pr-14">
                  <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    Crea una opportunità
                  </h4>
                </div>
                <div className="px-2 overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                    <div>
                      <Label>Nome</Label>
                      <Input
                        type="text"
                        value={opportunityToCreate?.name}
                        onChange={(e) =>
                          setOpportunityToCreate({
                            ...opportunityToCreate,
                            name: e.currentTarget.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label>Valore</Label>
                      <Input
                        type="number"
                        value={opportunityToCreate?.value}
                        min="0"
                        onChange={(e) =>
                          setOpportunityToCreate({
                            ...opportunityToCreate,
                            value: Number(e.currentTarget.value),
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label>Stato</Label>
                      <Select
                        placeholder="Seleziona uno stato"
                        className="capitalize"
                        options={[
                          { value: "nuova", label: "Nuova" },
                          { value: "in corso", label: "In corso" },
                          { value: "vinta", label: "Vinta" },
                          { value: "persa", label: "Persa" },
                        ]}
                        onChange={(e) =>
                          setOpportunityToCreate({
                            ...opportunityToCreate,
                            stage: String(e),
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Contatto</Label>
                      {infoList?.contacts?.length > 0 ? (
                        <SelectAutocomplete
                          options={infoList?.contacts}
                          placeholder="Seleziona un contatto"
                          onChange={(e) => {
                            setOpportunityToCreate({
                              ...opportunityToCreate,
                              contact_id: String(e),
                            });
                          }}
                        />
                      ) : (
                        <>
                          <p className="dark:text-white">
                            Sembra che non ci siano contatti
                          </p>
                          <Button
                            onClick={() => {
                              navigate("/clienti");
                              sessionStorage.setItem("createContact", "true");
                            }}
                            className=""
                          >
                            Crea un nuovo contatto
                          </Button>
                        </>
                      )}
                    </div>
                    <div>
                      <Label>Assegnato a</Label>
                      <SelectAutocomplete
                        options={infoList?.users}
                        placeholder="Seleziona un assegnatario"
                        onChange={(e) => {
                          setOpportunityToCreate({
                            ...opportunityToCreate,
                            user_id: String(e),
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setContactModal(false)}
                  >
                    Chiudi
                  </Button>
                  <Button onClick={() => handleCreateOpportunity()}>
                    Crea
                  </Button>
                </div>
              </div>
            </div>
          }
        />
      </div>
      <OpportunityTable
        searchDrill={searchDrill}
        infoList={infoList}
        allowedActions={allowedActions}
        setContactModal={setContactModal}
        optionsFilters={optionFilters as string}
        searchText={searchText}
        isWriting={isWriting}
        successMessage={successMessage}
        errorMessage={errorMessage}
        setSuccessMessage={setSuccessMessage}
        setErrorMessage={setErrorMessage}
      />
    </>
  );
};

export default Opportunita;
