import { IContactData } from "../../interfaces/contacts";
import { getStandardHeaders } from "../ApiUtils/utils";

const contactsUrl = `${import.meta.env.VITE_BACKEND_URL}/contacts`;

const getCompleteContactList = async () => {
  let url = contactsUrl;

  const res = await fetch(`${url}?full=full`, {
    method: "GET",
    headers: getStandardHeaders(),
  });
  try {
    const data = await res.json();
    const status = res.status;
    if (data && status === 200) {
      return { data, message: "Complete contact list" };
    } else {
      console.log(`Returning full contact list`);
    }
  } catch (error) {
    console.log(error);
  }
  return;
};

/**
 * Ottenimento di tutti i contatti
 */

const getContacts = async (
  page?: number,
  searchText?: string,
  filter?: string,
  sortOrder?: { order: string; field: string }
) => {
  let url;

  const order = sortOrder?.order as string
  const field = sortOrder?.field as string


  if (searchText && page || order && field) {
    url = `${contactsUrl}/?page=${page}&search=${searchText}&filter=${filter}&order=${order}&field=${field}`;
  } else {
    url = `${contactsUrl}/?page=${page}`;
  }

  const res = await fetch(url, {
    method: "GET",
    headers: getStandardHeaders(),
  });

  try {
    const data = await res.json();
    const status = res.status;

    if (data && status === 200) {
      return { data, message: "contacts" };
    } else {
    }
  } catch (error) {
    console.log(error);
  }
};

const getContactDetails = async (id: string) => {
  const res = await fetch(`${contactsUrl}/${id}`, {
    method: "GET",
    headers: getStandardHeaders(),
  });

  try {
    const data = await res.json();
    const status = res.status;
    if (data && status === 200) {
      return { data, message: "user" };
    } else {
    }
  } catch (error) {
    console.log(error);
  }
};
/**
 * Creazione di un contatto
 */
const createContact = async (body: IContactData) => {
  const res = await fetch(`${contactsUrl}`, {
    method: "POST",
    headers: getStandardHeaders(),
    body: JSON.stringify(body),
  });
  try {
    const data = await res.json();
    const status = res.status;
    if (data && status === 201) {
      return { data, status: true };
    } else {
      return { status: false, code: status, data };
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * Aggiornamento di un contatto
 */
const updateContact = async (_id: string, data: any) => {
  const res = await fetch(`${contactsUrl}/${_id}`, {
    method: "PATCH",
    headers: getStandardHeaders(),
    body: JSON.stringify(data),
  });
  try {
    const data = await res.json();
    const status = res.status;
    if (data && status === 200) {
      return { data, message: "Contact" };
    } else {
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteContact = async (_id: string) => {
  const res = await fetch(`${contactsUrl}/${_id}`, {
    method: "DELETE",
    headers: getStandardHeaders(),
  });
  try {
    const data = await res.json();
    const status = res.status;
    if (data && status === 200) {
      return { data, message: "user" };
    } else {
    }
  } catch (error) {
    console.log(error);
  }
};

export const ContactApi = {
  getCompleteContactList,
  getContacts,
  getContactDetails,
  createContact,
  updateContact,
  deleteContact,
};
