import mongoose from "mongoose";
import { Opportunity } from "../../models/opportunity/opportunity-model";
import { mockedContactId, mockedUserId } from "./mockedDatas";

export const createMultipleTestOpportunities = async (
  numberOfContacts: number
) => {
  const opportunities = [];

  for (let i = 0; i < numberOfContacts; i++) {
    const _id = new mongoose.Types.ObjectId();
    const opportunity = new Opportunity({
      _id,
      name: `TestOpportunity${i}`,
      value: `500${i}`,
      stage: `nuova`,
      contact_id: mockedContactId,
      user_id: mockedUserId ,
      activities: [],
    });
    opportunities.push(opportunity);
  }

  return opportunities;
};

export const createSingleTestOpportunity = async () => {
  const _id = new mongoose.Types.ObjectId();

  const opportunity = new Opportunity({
    _id,
    name: `Leo_Opportunity`,
    value: `2499`,
    stage: `in corso`,
    contact_id: mockedContactId,
    user_id: mockedUserId,
    activities: [],
  });
  return opportunity;
};

// 
// export const  = async () => {
//   const _id = new mongoose.Types.ObjectId();

//   const opportunity = new Opportunity({
//     _id,
//     name: `Leo_Opportunity`,
//     value: `2499`,
//     stage: `in corso`,
//     contact_id: mockedContactId,
//     user_id: mockedUserId,
//     activities: [],
//   });
//   return opportunity;
// };
