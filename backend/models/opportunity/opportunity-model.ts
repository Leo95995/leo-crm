import mongoose from "mongoose";

const Schema = mongoose.Schema;

const opportunitySchema = new Schema({
  name: { type: String, required: true },
  value: { type: Number, required: true },
  stage: {
    type: String,
    enum: ["nuova", "in corso", "vinta", "persa"],
    default: "nuova",
  },
  contact_id: { type: Schema.Types.ObjectId, ref: "Contact" },
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  activities: [
    {
      description: { type: String, required: true },
      date: { type: Date, default: Date.now },
      status: {
        type: String,
        enum: ["In corso", "Completata", "Pianificata", "In attesa"],
        default: "Pianificata",
      },
    },
  ],

  createdAt: { type: Date, default: Date.now },
});

export const Opportunity = mongoose.model("Opportunity", opportunitySchema);
