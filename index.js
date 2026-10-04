import express from "express";
import router from "./src/router.js";

const app = express();
const PORT = process.env.PORT || 4001;

app.use("/", router);

app.listen(PORT, () => console.log(`microservicio de prueba en ${PORT}`));
