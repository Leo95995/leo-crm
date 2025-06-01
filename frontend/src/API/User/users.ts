import { ISignin } from "../../interfaces/signin";
import { IUserData } from "../../interfaces/signup";
import { getStandardHeaders } from "../ApiUtils/utils";
const usersUrl = `${import.meta.env.VITE_BACKEND_URL}/users`;

/**
 * Recupero di tutti gli utenti:
 */

const getCompleteUserList = async () => {
  let url = usersUrl;

  const res = await fetch(`${url}?full=full`, {
    method: "GET",
    headers: getStandardHeaders(),
  });
  try {
    const data = await res.json();
    const status = res.status;
    if (data && status === 200) {
      return { data, message: "UserList complete" };
    } else {
      console.log(`error`);
    }
  } catch (error) {
    console.log(error);
  }
  return;
};

/**
 * 
 * GET /users with pagination and filters
 * 
 * @param page 
 * @param searchText 
 * @param filter 
 * @param sortOrder 
 * @returns 
 */
const getUsers = async (
  page?: number,
  searchText?: string,
  filter?: string,
  sortOrder?: {order: string; field: string}
) => {
  let url;
  const order = sortOrder?.order as string
  const field = sortOrder?.field as string
  
  if (searchText && page || order && field) {
    url = `${usersUrl}?page=${page}&search=${searchText}&filter=${filter}&order=${order}&field=${field}`;
  } else {
    url = `${usersUrl}?page=${page}`;
  }

  const res = await fetch(url, {
    method: "GET",
    headers: getStandardHeaders(),
  });
  try {
    const data = await res.json();
    const status = res.status;
    if (data && status === 200) {
      return { data, message: "users" };
    } else {
    }
  } catch (error) {
    console.log(error);
  }
};

const getUser = async (_id: string) => {
  const res = await fetch(`${usersUrl}/uid/${_id}`, {
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
// ------------ CREATE USER  / LOGIN ----------------------
const createUser = async (body: IUserData) => {
  const res = await fetch(`${usersUrl}/register`, {
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

const getUserRole = async () => {
  const res = await fetch(`${usersUrl}/role`, {
    method: "GET",
    headers: getStandardHeaders(),
  });
  try {
    const data = await res.json();
    const status = res.status;
    if (data && status == 200) {
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

const promoteUser = async (id: string, newRole: string) => {
  const res = await fetch(`${usersUrl}/promote/${id}`, {
    method: "PATCH",
    headers: getStandardHeaders(),
    body: JSON.stringify({ role: newRole }),
  });
  try {
    const data = await res.json();
    const status = res.status;
    if (data && status === 200) {
      return { status: true };
    } else {
      return { status: false };
    }
  } catch (error) {
    console.log(error);
  }
};

// To implement
const signin = async (body: ISignin) => {
  const res = await fetch(`${usersUrl}/signin`, {
    method: "POST",
    headers: getStandardHeaders(),
    body: JSON.stringify(body),
  });
  try {
    const data = await res.json();
    const status = res.status;
    if (data && status === 200) {
      return { data, status: true };
    } else {
      return { status: false };
    }
  } catch (error) {
    console.log(error);
  }
};

const updateUser = async (_id: string, data: any) => {
  const res = await fetch(`${usersUrl}/${_id}`, {
    method: "PATCH",
    headers: getStandardHeaders(),
    body: JSON.stringify(data),
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

const deleteUser = async (_id: string) => {
  const res = await fetch(`${usersUrl}/${_id}`, {
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

//  ------- JTW CHECKERS ----------
const verifyToken = async () => {
  const res = await fetch(`${usersUrl}/verify`, {
    method: "GET",
    headers: getStandardHeaders(),
  });
  try {
    const data = await res.json();
    const status = res.status;
    if (data && status === 200) {
      return { data, message: "user" };
    } else {
      return;
    }
  } catch (error) {
    console.log(error);
  }
};


const sendResetLink = async(username: string) => {
  const res = await fetch(`${usersUrl}/reset-link`, {
    method: "POST",
    body: JSON.stringify({username}),
    headers: getStandardHeaders(),
  });
  try {
    const data = await res.json();
    const status = res.status;
    if (data && status === 200) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 *Dalla confirmation page Uno useffect recupererà i dati del token e li invierà al backend
 *  il backend allora li andrà a utilizzare per verificare se il token è valido o meno e darà risposta
 */

const checkToken = async(token: string) => {
  console.log(token);

  const res = await fetch(`${usersUrl}/check-token/${token}`, {
    method: "GET",
    headers: getStandardHeaders(),
  });

  try {
    const data = await res.json();
    const status = res.status;
    if (data && status === 200) {
      return data
    } else {
      return false
    }
  } catch (error) {
    console.log(error);
  }
}
/**
 * Una volta che il token sarà accettato e confermato questa funzione si occuperà dopo il compilamento dei dati
 * da parte dell'utente di inviare i suddetti dati al db per aggiornare la password esistente   
 */
const resetUserPassword = async(newpassword: string, id: string) => {
  const res = await fetch(`${usersUrl}/reset-password/${id}`, {
    method: "PATCH",
    body: JSON.stringify({newPassword:newpassword}),
    headers: {"Content-Type": 'application/json'},
  });
  try {
    const data = await res.json();
    const status = res.status;
    if (data && status === 200) {
      return {status: "success", message: data}
    } else {
      return {status: "error", message:data}
    }
  } catch (error) {
    console.log(error);
  }
}


export const UsersAPI = {
  getCompleteUserList,
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  verifyToken,
  signin,
  getUserRole,
  promoteUser,
  sendResetLink, // -> Utente richiede link reset tramite mail
  checkToken, // ->
  resetUserPassword // -> 
};
