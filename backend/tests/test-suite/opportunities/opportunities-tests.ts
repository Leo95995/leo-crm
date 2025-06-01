// Opportunity model
import { Opportunity } from "../../../models/opportunity/opportunity-model";
// Import utils to generate JWT
import { JWT_UTILS } from "../../../controllers/user/JWT_utils";
// Import the app
import app from "../../../app";
// Importing supertest
import request from "supertest";

// Test opportunities
import {
  createSingleTestOpportunity,
  createMultipleTestOpportunities,
} from "../../test-utils/opportunityFactory";
import mongoose from "mongoose";

import dotenv from 'dotenv'
dotenv.config()

const jwt = JWT_UTILS.generateJwt({id:"6820f01ad10958de814ed268", username:'tester', role:'admin'});


// ---------------- Opportunities ---------------------------

test("GET /opportunities", async () => {
  const opportunityList = await createMultipleTestOpportunities(20);

  await Opportunity.insertMany(opportunityList);
  const res = await request(app)
    .get("/opportunities")
    .set("Authorization", `Bearer ${jwt}`)
    .expect(200);

  // Restituisce le opportunità paginate
  expect(res.body.opportunities.length).toBe(10);
});

/**
 * get single opportunity
 */

test("GET /opportunities/:id", async () => {
  const opportunityList = await createMultipleTestOpportunities(50);
  const opportunity_id = opportunityList[40]._id;

  await Opportunity.insertMany(opportunityList);

  const res = await request(app)
    .get(`/opportunities/${opportunity_id}`)
    .set("Authorization", `Bearer ${jwt}`)
    .expect(200);

  expect(res.body.name).toBe("TestOpportunity40");
  expect(res.body.value).toBe(50040);
  expect(res.body.stage).toBe("nuova");
});
/**
 * // post("/",  OpportunityController.createOpportunity);
 * Create Opportunity
 */

test("POST /opportunities", async () => {
  const testOpportunity = await createSingleTestOpportunity();
  const res = await request(app)
    .post("/opportunities")
    .set("Authorization", `Bearer ${jwt}`)
    .send(testOpportunity.toObject())
    .expect(201);

  // In realtà il body di ritorno va adattato perchè deve essere opportunity l'oggetto
  const { user } = res.body;
  expect(user.value).toBe(2499);
  expect(user.name).toBe("Leo_Opportunity");
  expect(user.stage).toBe("in corso");
});

/** */
// patch("/:id", OpportunityController.modifyOpportunity);

test("PATCH /opportunities/:id", async () => {
  const opportunityList = await createMultipleTestOpportunities(40);
  await Opportunity.insertMany(opportunityList);
  const opportunityToModify = opportunityList[25]._id;

  const opportunityElement = {
    name: "pippo",
    value: 250,
    stage: "in corso",
  };

  const res = await request(app)
    .patch(`/opportunities/${opportunityToModify}`)
    .set("Authorization", `Bearer ${jwt}`)
    .send(opportunityElement)
    .expect(200);

  expect(res.body.name).toBe("pippo");
  expect(res.body.value).toBe(250);
  expect(res.body.stage).toBe("in corso");
});

// Delete

test("DELETE /opportunities/:id", async () => {
  const opportunityList = await createMultipleTestOpportunities(40);
  await Opportunity.insertMany(opportunityList);

  const opportunityToDelete = opportunityList[12]._id;

  const res = await request(app)
    .delete(`/opportunities/${opportunityToDelete}`)
    .set("Authorization", `Bearer ${jwt}`)
    .expect(200);

  // Verifico che l'elemento inserito sia effettivamente rimosso dal db
  const shouldBeDeleted = await Opportunity.findById(opportunityToDelete);
  expect(shouldBeDeleted).toBeNull();
});

/**
 * Add activity to opportunity
 */

test("POST  opportunities/activity/:id", async () => {
  // Creazione di un opportunità senza attività
  const opportunity = await createSingleTestOpportunity();
  await opportunity.save();
  const idToPatch = opportunity._id;

  const newActivity = {
    description: `Testing`,
    date: "21/05/2025",
    status: "Completata",
  };

  const res = await request(app)
    .post(`/opportunities/activity/${idToPatch}`)
    .set("Authorization", `Bearer ${jwt}`)
    .send(newActivity)
    .expect(201);
  // Verifico che l'elemento inserito sia effettivamente rimosso dal db

  const activityToCheck = res.body.activities[0];

  expect(activityToCheck).toBeDefined();
  expect(activityToCheck.description).toBe("Testing");
  expect(activityToCheck.status).toBe("Completata");
});

// -------------------------- ACTIVITIES -----------------opportun

test("PATCH  opportunities/activity/:id", async () => {
  // Creazione di un opportunità senza attività
  const opportunity = await createSingleTestOpportunity();
  await opportunity.save();
  const idToPatch = opportunity._id;

  const newActivity = {
    description: `Testing`,
    date: "21/05/2025",
    status: "Completata",
  };

  const res = await request(app)
    .post(`/opportunities/activity/${idToPatch}`)
    .set("Authorization", `Bearer ${jwt}`)
    .send(newActivity)
    .expect(201);

  const activityId: string = res?.body?.activities[0]?._id;

  const modifiedActivity = {
    description: `Updated`,
    date: "25/05/2025",
    status: "Pianificata",
  };

  const resPatch = await request(app)
    .patch(`/opportunities/activity/${idToPatch}`)
    .set("Authorization", `Bearer ${jwt}`)
    .set("activityid", `${activityId}`)
    .send(modifiedActivity)
    .expect(200);

  const activityToCheck = resPatch.body.opportunityToChange.activities[0];

  expect(activityToCheck).toBeDefined();
  expect(activityToCheck.description).toBe("Updated");
  expect(activityToCheck.status).toBe("Pianificata");
});

//------------------- DELETE OPPORTUNITIES ------------------------------
test("PATCH  opportunities/activity/:id", async () => {
  // Creazione di un opportunità senza attività
  const opportunity = await createSingleTestOpportunity();
  await opportunity.save();
  const idToPatch = opportunity._id;

  const newActivity = {
    description: `Testing`,
    date: "21/05/2025",
    status: "Completata",
  };

  const res = await request(app)
    .post(`/opportunities/activity/${idToPatch}`)
    .set("Authorization", `Bearer ${jwt}`)
    .send(newActivity)
    .expect(201);

  const activityId: string = res?.body?.activities[0]?._id;


  const resDelete = await request(app)
  .delete(`/opportunities/activity/${idToPatch}`)
  .set(`Authorization`, `Bearer ${jwt}`)
  .set("activityid", `${activityId}`)
  .expect(200)

  const activityToCheck = resDelete?.body?.opportunityToChange?.activities[0];

  expect(activityToCheck).toBeUndefined();

});
