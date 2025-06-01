import { getStandardHeaders } from "../ApiUtils/utils";
import { IActivity } from "../../interfaces/opportunities";

const opportunityUrl = `${import.meta.env.VITE_BACKEND_URL}/opportunities`;

/**
 * Le activity sono strettamente collegate alle singole opportunity.
 */

const addActivityToOpportunity = async (opportunityId: string, body: any) => {
  const res = await fetch(`${opportunityUrl}/activity/${opportunityId}`, {
    method: "POST",
    headers: getStandardHeaders(),
    body: JSON.stringify(body),
  });
  try {
    const data = await res.json();
    const status = res.status;
    if (data && status === 201) {
      return { data, status: true,  code: status };
    } else {
      return { status: false, code: status, data };
    }
  } catch (error) {
    console.log(error);
  }
};

const updateActivityFromOpportunity = async (
  opportunityId: string,
  activityId: string,
  data: Partial<IActivity>
) => {
  // 
  const res = await fetch(`${opportunityUrl}/activity/${opportunityId}`, {
    method: "PATCH",
    headers: getStandardHeaders([{ activityId: activityId }]),
    body: JSON.stringify(data),
  });
  try {
    const data = await res.json();
    const status = res.status;
    if (data && status === 200) {
      return { data, message: "Activity Updated" };
    } else {
      return false
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteActivityFromOpportunity = async (
  opportunityId: string,
  activityId: string
) => {
  const res = await fetch(`${opportunityUrl}/activity/${opportunityId}`, {
    method: "DELETE",
    headers: getStandardHeaders([{ activityId: activityId }]),
  });
  try {
    const data = await res.json();
    const status = res.status;
    if (data && status === 200) {
      return { data, message: `Activity deleted` };
    } else {
      return {}
    }
  } catch (error) {
    console.log(error);
  }
};

export const API_Activity = {
  addActivityToOpportunity,
  updateActivityFromOpportunity,
  deleteActivityFromOpportunity,
};
