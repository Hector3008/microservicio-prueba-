import express from "express";
import { MongoClient } from "mongodb";
import createRouter from "./src/router.js";

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db(process.env.MONGODB_DB || "prueba-local");

const app = express();
app.use("/", createRouter({ db }));

app.listen(process.env.PORT || 4001, () =>
  console.log("microservicio en local"),
);
