import express, { Router } from "express";

export default function createRouter({ db }) {
  const router = Router();
  const items = db.collection("prueba_items");

  router.use(express.json());

  router.get("/", (req, res) =>
    res.json({ msg: "Hola desde el microservicio de prueba" }),
  );

  router.get("/items", async (req, res) => {
    res.json(await items.find().limit(50).toArray());
  });

  router.post("/items", async (req, res) => {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: "falta nombre" });
    const { insertedId } = await items.insertOne({
      nombre,
      creado: new Date(),
    });
    res.status(201).json({ _id: insertedId, nombre });
  });

  return router;
}
