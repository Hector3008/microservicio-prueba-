import { Router } from "express";

const router = Router();

router.get("/", (req, res) =>
  res.json({ msg: "Hola desde el microservicio de prueba" }),
);
router.get("/servidor", (req, res) => res.json({ status: "ok" }));

export default router;
