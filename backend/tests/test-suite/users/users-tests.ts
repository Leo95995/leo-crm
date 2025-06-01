// Importo supertest che si occupa di simulare le chiamate http;
import request from "supertest";
// Importo l'applicazione
import { User } from "../../../models/user/user-model";
import app from "../../../app";
import { JWT_UTILS } from "../../../controllers/user/JWT_utils";
import {
  createMultipleTestUsers,
  createSingleTestUser,
} from "../../test-utils/userFactory";

import dotenv from "dotenv";
dotenv.config();

const jwt = JWT_UTILS.generateJwt({
  id: "6820f01ad10958de814ed268",
  username: "tester",
  role: "admin",
});

/**
 * Restituisce la lista degli utenti paginati
 */

test("GET /users?page=2 restituisce gli utenti paginati (10 per pagina)", async () => {
  const userList = await createMultipleTestUsers(20);

  await User.insertMany(userList);

  const res = await request(app)
    .get("/users?page=2")
    .set("Authorization", `Bearer ${jwt}`)
    .expect(200);

  const { users } = res.body;

  expect(users[0].username).toBe(`TestUser10`);
  expect(users[9].username).toBe(`TestUser19`);

  expect(users.length).toBe(10);
});

/**
 * Restituisce la lista completa degli utenti
 */

test("GET /users?full=full  restituisce la lista completa degli utenti", async () => {
  const usersList = await createMultipleTestUsers(60);
  await User.insertMany(usersList);

  const res = await request(app)
    .get("/users?full=full")
    .set("Authorization", `Bearer ${jwt}`)
    .expect(200);

  const { users } = res.body;

  expect(users.length).toBe(60); // Dovrebbero esserci due utenti
});

/**
 * Get to recover an user by its single id
 */

test("GET /users/uid/:id  recupera il dettaglio di un singolo utente tramite id", async () => {
  const usersList = await createMultipleTestUsers(20);
  await User.insertMany(usersList);
  const userId = usersList[12]._id;

  const res = await request(app)
    .get(`/users/uid/${userId}`)
    .set("Authorization", `Bearer ${jwt}`)
    .expect(200);

  expect(res.body).toBeDefined();

  const userChosen = await User.findById(userId);
  expect(userChosen?.username).toBe(`TestUser12`);
  expect(userChosen?.email).toBe(`test12@example.com`);
  expect(userChosen?.firstName).toBe(`test12first`);
  expect(userChosen?.lastName).toBe(`test12second`);
});

/**
 * Create User
 */
test("POST /users/register Register user( User Creation ) ", async () => {
  const singleUser = await createSingleTestUser();

  const res = await request(app)
    .post("/users/register")
    .send(singleUser.toObject())
    .expect(201);

  const { user } = res.body;
  expect(user.username).toBe("LeoUser");
  expect(user.email).toBe("leoUser@example.com");
  expect(user.firstName).toBe(`leoFirst`);
  expect(user.lastName).toBe(`leoSecond`);
  expect(user.role).toBe(`viewer`);
});

/**
 *  Test per ottenere un singolo utente per ID
 */
test("POST /users/signin testo il login dell'utente", async () => {
  const userData = await createSingleTestUser();
  const password = userData.password;
  const username = userData.username;

  // Regstration
  await request(app)
    .post("/users/register")
    .send(userData.toObject())
    .expect(201);

  // Cheking login after registration after the saved data
  const res = await request(app)
    .post(`/users/signin`)
    .send({ username: username, password: password })
    .expect(200);

  // Verufico che venga restituito lo userData e il token
  expect(res.body.userToRet).toBeDefined();
  expect(res.body.token).toBeDefined();
});

test("PATCH /users/promote/:id elevazione dei ruoli utente", async () => {
  const userData = await createSingleTestUser();
  const id = String(userData._id);

  await userData.save();
  const role = "admin";

  // Regstration
  await request(app)
    .patch(`/users/promote/${id}`)
    .send({ role: role })
    .set("Authorization", `Bearer ${jwt}`)
    .expect(200);

  // Cheking login after registration after the saved data
  let userModified = await User.findById(id);
  expect(userModified?.role).toBe("admin");
});

//

test("PATCH /users/:id Modify user", async () => {
  const userData = await createSingleTestUser();
  const id = String(userData._id);

  await userData.save();
  const userDetails = {
    email: "modificato@test.it",
    firstName: "modificatoFirst",
    lastName: "modificatoLast",
  };

  // Regstration
  await request(app)
    .patch(`/users/${id}`)
    .send(userDetails)
    .set("Authorization", `Bearer ${jwt}`)
    .expect(200);

  // Check userData
  let userModified = await User.findById(id);

  expect(userModified?.email).toBe("modificato@test.it");
  expect(userModified?.firstName).toBe("modificatoFirst");
  expect(userModified?.lastName).toBe("modificatoLast");
});

// Verifica del token
test("GET /users/verify Funzione per verificare la validità del token generato", async () => {
  await request(app)
    .get(`/users/verify`)
    .set("Authorization", `Bearer ${jwt}`)
    .expect(200);
});

// DELETE USERS

test("DELETE /users/:id Verifica la cancellazione di un utente tramite id", async () => {
  const usersList = await createMultipleTestUsers(20);
  const userIdToDel = usersList[10]._id;
  await User.insertMany(usersList);

  await request(app)
    .delete(`/users/${userIdToDel}`)
    .set("Authorization", `Bearer ${jwt}`)
    .expect(200);
  //  Mi aspetto che dopo la cancellazione recuperare quell'oggetto dal db mi fornisca un risultato nullo
  const toBeAbsent = await User.findById(userIdToDel);
  expect(toBeAbsent).toBeNull();
});
