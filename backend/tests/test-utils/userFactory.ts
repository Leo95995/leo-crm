import mongoose from "mongoose";
import { User } from "../../models/user/user-model";

export const createMultipleTestUsers = async (numberOfContacts: number) => {
  const users = [];

  for (let i = 0; i < numberOfContacts; i++) {
    const _id = new mongoose.Types.ObjectId();
    const user = new User({
      _id,
      username: `TestUser${i}`,
      email:`test${i}@example.com`,
      firstName: `test${i}first`,
      lastName: `test${i}second`,
      password: `TestingTest99!`,
      role: `viewer`,
      contacts: [],
      opportunities: [],
      termsCondition: true,
    });
    users.push(user);
  }

  return users;
};

export const createSingleTestUser = async () => {
  const _id = new mongoose.Types.ObjectId();

  const user = new User({
    _id,
    username: `LeoUser`,
    email:`leoUser@example.com`,
    firstName: `leoFirst`,
    lastName: `leoSecond`,
    password: `TestingTest99!`,
    role: `viewer`,
    contacts: [],
    opportunities: [],
    termsCondition: true,
  });
  return user;
};
