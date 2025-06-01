import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  setInternalLoad } from "../../../store/appStore";
import { useNavigate } from "react-router";

// Api
import { ContactApi } from "../../../API/Contacts/contacts";
import { IPage } from "../../../interfaces/pages";

// Components
import ClientTable from "./ClientTables";
import Button from "../../../components/button/Button";
import { Modal } from "../../../components/modal";
import { IContactData } from "../../../interfaces/contacts";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import SearchIcon from "@mui/icons-material/Search";
import Select from "../../../components/form/Select";

//Datas for filters
import { clientFilters } from "../../shared-datas/generic-datas";
import PageMeta from "../../../components/common/PageMeta";

const Clienti: React.FC<IPage> = ({ userRole }) => {
  const [contactModal, setContactModal] = useState<boolean>(false);
  const userdata = useSelector((state: any) => state.app.userdata);
  const [contactToCreate, setContactToCreate] = useState<IContactData>({
    name: "",
    email: "",
    phone: "",
    user_id: userdata._id,
  });
  const [allowedActions, setAllowedActions] = useState<string[]>([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Filter options
  const [optionsFilters, setOptionFilters] = useState<string>();
  const [searchText, setSearchText] = useState<string>("");
  const [searchDrill, setSearchDrill] = useState<boolean>();
  const [isWriting, setIsWriting] = useState<boolean>(false);

  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleFilterSelection = (value: any) => {
    const selected_filter = clientFilters.find(
      (filter) => filter.value === value
    );
    setOptionFilters(selected_filter?.label as string);
  };

  useEffect(() => {
    if (userRole) {
      setAllowedActions(userRole?.permissions);
    }
    const selected_filter = clientFilters.find(
      (filter) => filter.value === "name"
    );
    setOptionFilters(selected_filter?.label as string);
  }, [userRole, contactModal]);

  useEffect(() => {
    if (sessionStorage.createContact === "true") {
      setContactModal(true);
      sessionStorage.setItem("createContact", "false");
    }
  }, [sessionStorage.createContact]);

  const handleCreateContact = () => {
    ContactApi.createContact(contactToCreate)
      .then((res) => {
        if (res?.status) {
          setSuccessMessage("Contatto creato con successo");
          setTimeout(() => {
            setSuccessMessage("");
          }, 3000);
          dispatch(setInternalLoad(true));
          setTimeout(() => {
            dispatch(setInternalLoad(false));
          }, 500);
          setContactModal(false);
          if (sessionStorage.createContact === "false") {
            navigate("/opportunita");
            sessionStorage.setItem("createContact", "clear");
          }
        }else {
              setErrorMessage("Errore nella creazione del contatto");
          setTimeout(() => {
            setErrorMessage("");
          }, 3000);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <PageMeta
        title="LEO CRM | Contatti "
        description="LEO CRM Pagina opportunità"
      />
      {
        <>
          <div className="flex gap-5 my-6 flex-col sm:flex-row">
            <div>
              <div>
                <Select
                  options={clientFilters}
                  onChange={handleFilterSelection}
                  placeholder="Ricerca per"
                  staticVal={`name`}
                />
              </div>
            </div>
            <div className="flex">
              {" "}
              <Input
                type="text"
                disabled={!optionsFilters}
                placeholder={`${
                  optionsFilters
                    ? `Ricerca clienti  per ${optionsFilters}`
                    : "Seleziona un criterio di ricerca"
                }`}
                onKeyPress={() => setSearchDrill((prev) => !prev)}
                onChange={(e) => {
                  setIsWriting(true);
                  setSearchText(e.currentTarget.value);
                  setTimeout(() => {
                    setIsWriting(false);
                  }, 1000);
                }}
              />
              <Button
                onClick={() => setSearchDrill((prev: any) => !prev)}
                size="sm"
                className="flex justify-center items-center"
              >
                <div className="visible md:collapse"> Cerca </div>
                <SearchIcon style={{ fontSize: "18px" }} className="text-lg" />
              </Button>
            </div>

            <Button size="sm" onClick={() => setContactModal(true)}>
              Crea contatto
            </Button>
          </div>
          <Modal
            isOpen={contactModal}
            onClose={() => {
              setContactModal(false);
              sessionStorage.removeItem("createContact");
            }}
            className="max-w-[700px] m-4"
            children={
              <div>
                <div className="relative w-full p-4 overflow-y-auto  bg-white no-scrollbar rounded-3xl  dark:bg-gray-900 sm:flex-col  lg:p-11">
                  <div className="px-2 pr-14">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                      Crea un nuovo cliente
                    </h4>
                  </div>
                  <div className="px-2 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                      <div>
                        <Label>Nome</Label>
                        <Input
                          type="text"
                          value={contactToCreate?.name}
                          onChange={(e) =>
                            setContactToCreate({
                              ...contactToCreate,
                              name: e.currentTarget.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          type="text"
                          value={contactToCreate?.email}
                          onChange={(e) =>
                            setContactToCreate({
                              ...contactToCreate,
                              email: e.currentTarget.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Numero di Telefono</Label>
                        <Input
                          type="text"
                          value={contactToCreate?.phone}
                          onChange={(e) =>
                            setContactToCreate({
                              ...contactToCreate,
                              phone: e.currentTarget.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        sessionStorage.removeItem("createContact");
                        setContactModal(false);
                      }}
                    >
                      Chiudi
                    </Button>
                    <Button onClick={() => handleCreateContact()}>Crea</Button>
                  </div>
                </div>{" "}
              </div>
            }
          />
          <ClientTable
            allowedActions={allowedActions}
            setCreateContactModal={setContactModal}
            optionsFilters={optionsFilters as string}
            searchText={searchText}
            searchDrill={searchDrill}
            isWriting={isWriting}
            successMessage={successMessage}
            setSuccessMessage={setSuccessMessage}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
          />
        </>
      }
    </>
  );
};

export default Clienti;
