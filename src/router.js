import express, { Router } from "express";
import { ObjectId } from "mongodb";

export default function createRouter({ db }) {
  const router = Router();
  const items = db.collection("prueba_items");

  router.use(express.json());

  // Valida el :id y lo convierte a ObjectId
  const validarId = (req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "id inválido" });
    }
    req.oid = new ObjectId(req.params.id);
    next();
  };

  const nombreValido = (nombre) =>
    typeof nombre === "string" && nombre.trim().length > 0;

  router.get("/", (req, res) =>
    res.json({ msg: "Hola desde el microservicio de prueba" }),
  );

  // CREATE
  router.post("/items", async (req, res) => {
    const { nombre } = req.body ?? {};
    if (!nombreValido(nombre)) {
      return res.status(400).json({ error: "falta nombre" });
    }
    const doc = { nombre: nombre.trim(), creado: new Date() };
    const { insertedId } = await items.insertOne(doc);
    res.status(201).json({ _id: insertedId, ...doc });
  });

  // READ (lista)
  router.get("/items", async (req, res) => {
    res.json(await items.find().sort({ creado: -1 }).limit(50).toArray());
  });

  // READ (uno)
  router.get("/items/:id", validarId, async (req, res) => {
    const item = await items.findOne({ _id: req.oid });
    if (!item) return res.status(404).json({ error: "no encontrado" });
    res.json(item);
  });

  // UPDATE
  router.put("/items/:id", validarId, async (req, res) => {
    const { nombre } = req.body ?? {};
    if (!nombreValido(nombre)) {
      return res.status(400).json({ error: "falta nombre" });
    }
    const item = await items.findOneAndUpdate(
      { _id: req.oid },
      { $set: { nombre: nombre.trim(), actualizado: new Date() } },
      { returnDocument: "after" },
    );
    if (!item) return res.status(404).json({ error: "no encontrado" });
    res.json(item);
  });

  // DELETE
  router.delete("/items/:id", validarId, async (req, res) => {
    const { deletedCount } = await items.deleteOne({ _id: req.oid });
    if (!deletedCount) return res.status(404).json({ error: "no encontrado" });
    res.status(204).end();
  });

  return router;
}
