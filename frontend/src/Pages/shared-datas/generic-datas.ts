import { IOptions } from "../../interfaces/generic";


/**
 * Clients / Contacts
 */
enum ClientFilterOptions {
    EMAIL = "email",
    NAME = "name",
    NUMBER = "phone",
  }
 
 export const clientFilters: IOptions[] = [
    { value: ClientFilterOptions.EMAIL, label: "Email" },
    { value: ClientFilterOptions.NAME, label: "Nome" },
    { value: ClientFilterOptions.NUMBER, label: "Numero" },
  ];


/**
 * Users 
 */

  enum UserFilterOptions {
    EMAIL = "email",
    USERNAME = "username",
    FIRST_NAME = "firstName",
    LAST_NAME = "lastName",
    ROLE = "role"
  }

 export const userFilters: IOptions[] = [
    { value: UserFilterOptions.USERNAME, label: "Utente" },
    { value: UserFilterOptions.EMAIL, label: "Email" },
    { value: UserFilterOptions.FIRST_NAME, label: "Nome" },
    { value: UserFilterOptions.LAST_NAME, label: "Cognome" },
    {value: UserFilterOptions.ROLE, label: 'Ruolo'}
  ];

/**
 *  Opportunities
 */

enum OpportunityFiltersOptions {
  NAME = "name",
  VALUE = "value",
  STAGE = "stage"
}
export const opportunityFilters: IOptions[] = [
  { value: OpportunityFiltersOptions.NAME, label: "Nome" },
  { value: OpportunityFiltersOptions.VALUE, label: "Valore" },
  {value: OpportunityFiltersOptions.STAGE, label: "Stato"},

];



		