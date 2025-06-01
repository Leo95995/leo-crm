import { Contact } from "../../../models/contact/contact-model";
// Importo supertest che si occupa di simulare le chiamate http;
import request from "supertest";
// Importo l'applicazione
import app from "../../../app";
// Import utils to generate JWT
import { JWT_UTILS } from "../../../controllers/user/JWT_utils";
// Import utils to generate Contacts
import {  createMultipleTestContacts, createSingleTestContact } from "../../test-utils/contactFactory";
import dotenv from 'dotenv'
dotenv.config()

//Prepare a jwt based on a user id
const jwt = JWT_UTILS.generateJwt({id:"6820f01ad10958de814ed268", username: 'pippo', role:'admin'});

//------------------------- GET REQUESTS --------------------------

test("GET /contacts?full=full  Restituzione di tutti i contatti", async () => {
  const contactList = await createMultipleTestContacts(20);

  await Contact.insertMany(contactList);

  const res = await request(app)
    .get("/contacts?full=full")
    .set("Authorization", `Bearer ${jwt}`)
    .expect(200);

  expect(res.body.contacts.length).toBe(20); // Dovrebbero esserci due utenti
});

// GET List of paginated contact

test("GET /contacts?page=3 Restituzione dei contatti paginati", async () => {
  const contactList = await createMultipleTestContacts(30);
  await Contact.insertMany(contactList);

  const res = await request(app)
    .get("/contacts?page=2")
    .set("Authorization", `Bearer ${jwt}`)
    .expect(200);
  expect(res.body.contacts.length).toBe(10); // Dovrebbero esserci solo i 10 utenti di pagina 2
});

/**
 * Recupero di contatti con filtro
 */

test("GET /contacts?page=number&search=string&filter=string Restituzione contatti filtrati", async () => {
  const contactList = await createMultipleTestContacts(50);
  await Contact.insertMany(contactList);

  const res = await request(app)
    .get("/contacts/?page=1&search=Contact48&filter=name")
    .set("Authorization", `Bearer ${jwt}`)
    .expect(200);

  expect(res.body.contacts[0].name).toBe("TestContact48");
  expect(res.body.contacts[0].phone).toBe("333333348");
  expect(res.body.contacts[0].email).toBe("testContact48@example.com");
  expect(res.body.contacts.length).toBe(1);
});

// GET Single contact by ID
test("GET /contacts/:id restituisce", async () => {
  const contactList = await createMultipleTestContacts(50);
  const contact_id = contactList[40]._id;

  await Contact.insertMany(contactList);

  const res = await request(app)
    .get(`/contacts/${contact_id}`)
    .set("Authorization", `Bearer ${jwt}`)
    .expect(200);

  expect(res.body.name).toBe("TestContact40");
  expect(res.body.email).toBe("testContact40@example.com");
  expect(res.body.phone).toBe("333333340");
});

/**
 * Test per la creazione di un singolo utente
 */

test("POST /contacts crea un nuovo contatto", async () => {
  const testContact = await createSingleTestContact();
  // Il contact va prima convertito in un plain object e poi me lo posso passare
  const res = await request(app)
    .post("/contacts")
    .set("Authorization", `Bearer ${jwt}`)
    .send(testContact.toObject())
    .expect(201);

  const { contact } = res.body;

  expect(contact.name).toBe("leon");
  expect(contact.email).toBe("leon@test.it");
  expect(contact.phone).toBe("333333333");
  expect(contact.user_id).toBe("6820f01ad10958de814ed268");
});

/**
 *  Patch di un Contatto
 *  verifico che modifichi sempre un determinato contatto
 *  restituendo l'oggetto più recente
 */

test("PATCH  to /contacts/:id modifica dettaglio contatto", async () => {
  const contactList = await createMultipleTestContacts(20);
  await Contact.insertMany(contactList);
  const contactToEditId = contactList[10]._id;

  const res = await request(app)
    .patch(`/contacts/${contactToEditId}`)
    .set("Authorization", `Bearer ${jwt}`)
    .send({ name: "Modified", email: "modificato@test.it", phone: "1111111" })
    .expect(200);
  const updateContact = res.body;

  expect(updateContact.name).toBe("Modified");
  expect(updateContact.email).toBe("modificato@test.it");
  expect(updateContact.phone).toBe("1111111");
});

/**
 *
 */
test("DELETE  to /contacts/:id Eliminazione di un contatto", async () => {
  const contactList = await createMultipleTestContacts(20);
  await Contact.insertMany(contactList);
  const contactToRemove = contactList[15]._id;

  const res = await request(app)
    .delete(`/contacts/${contactToRemove}`)
    .set("Authorization", `Bearer ${jwt}`)
    .expect(200);

  const updateContact = res?.body;

  expect(updateContact.name).toBe("TestContact15");
  expect(updateContact.email).toBe("testContact15@example.com");
  expect(updateContact.phone).toBe("333333315");
});
