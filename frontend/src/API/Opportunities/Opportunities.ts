import { IOpportunity } from "../../interfaces/opportunities";
import { getStandardHeaders } from "../ApiUtils/utils";

const opportunityUrl = `${import.meta.env.VITE_BACKEND_URL}/opportunities`;

const getOpportunities = async (
  page?: number,
  searchText?: string,
  filter?: string,
  sortOrder?: { order: string; field: string }
) => {
  let url;
  const order = sortOrder?.order as string;
  const field = sortOrder?.field as string;
  if ((searchText && page) || (order && field)) {
    url = `${opportunityUrl}/?page=${page}&search=${searchText}&filter=${filter}&order=${order}&field=${field}`;
  } else {
    url = `${opportunityUrl}/?page=${page}`;
  }
  const res = await fetch(url, {
    method: "GET",
    headers: getStandardHeaders(),
  });
  try {
    const data = await res.json();
    const status = res.status;

    if (data && status === 200) {
      return { data, message: "opportunities" };
    } else {
    }
  } catch (error) {
    console.log(error);
  }
};

const getKPIDashboard = async () => {
  const res = await fetch(`${opportunityUrl}/kpi-dashboard`, {
    method: "GET",
    headers: getStandardHeaders(),
  });
  try {
    const data = await res.json();
    const status = res.status;

    if (data && status === 200) {
      return { data, message: "Kpi dashboard" };
    } else {
    }
  } catch (error) {
    console.log(error);
  }
};

const getOpportunityDetails = async (id: string) => {
  const res = await fetch(`${opportunityUrl}/${id}`, {
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
const createOpportunity = async (body: IOpportunity) => {
  const res = await fetch(`${opportunityUrl}`, {
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

const updateOpportunity = async (_id: string, data: any) => {
  const res = await fetch(`${opportunityUrl}/${_id}`, {
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

const deleteOpportunity = async (_id: string) => {
  const res = await fetch(`${opportunityUrl}/${_id}`, {
    method: "DELETE",
    headers: getStandardHeaders(),
  });
  try {
    const data = await res.json();
    const status = res.status;
    if (data && status === 200) {
      return { data, message: "Opportunity deleted with success" };
    } else {
    }
  } catch (error) {
    console.log(error);
  }
};

export const OpportunityAPI = {
  getOpportunities,
  getOpportunityDetails,
  deleteOpportunity,
  updateOpportunity,
  createOpportunity,
  getKPIDashboard,
};
