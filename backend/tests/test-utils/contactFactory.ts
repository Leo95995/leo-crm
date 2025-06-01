import mongoose from "mongoose";
import { Contact } from "../../models/contact/contact-model";

export const createMultipleTestContacts = async (numberOfContacts: number) => {
  const contacts = [];

  for (let i = 0; i < numberOfContacts; i++) {
    const _id = new mongoose.Types.ObjectId();
    const contact = new Contact({
      _id,
      name: `TestContact${i}`,
      email: `testContact${i}@example.com`,
      phone: `3333333${i}`,
      user_id: "6820f01ad10958de814ed268",
    });
    contacts.push(contact);
  }

  return contacts;
};

export const createSingleTestContact = async () => {
  const _id = new mongoose.Types.ObjectId();

  const contact = new Contact({
    _id,
    name: `leon`,
    email: `leon@test.it`,
    phone: `333333333`,
    user_id: "6820f01ad10958de814ed268",
  });
  return contact;
};
