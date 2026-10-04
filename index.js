import express from "express";
const app = express();
const PORT = process.env.PORT || 4001;

app.get("/", (req, res) =>
  res.json({ msg: "Hola desde el microservicio de prueba" }),
);
app.get("/servidor", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => console.log(`hello en ${PORT}`));
