import app from "./app";
import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const db = process.env.MONGO_URI || "";
const options = {};

const port = process.env.PORT || 3000;

app.listen(port as any, "0.0.0.0", () => {
  console.log(`[SERVER]: Server is running at http://localhost:${port}`);
  mongoose
    .connect(db, options)
    .then((res) => {
      console.log("Connection successful to db, working");
    })
    .catch((e) => console.log(`There is an error`, e.toString()));
});