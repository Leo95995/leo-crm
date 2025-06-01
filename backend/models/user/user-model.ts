import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Senza una mail unica si può avere la stessa mail per più utenti... non so quanto sia  safe vabbè
const usersSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    termsCondition: { type: Boolean },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", usersSchema);
