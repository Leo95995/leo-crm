import mongoose from "mongoose";

const Schema = mongoose.Schema;

const contactSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone:  { type: String, required: true },
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true  },
});
export const Contact = mongoose.model("Contact", contactSchema);
