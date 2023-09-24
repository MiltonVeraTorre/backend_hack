import express from "express";

import {crearFondo, obtenerFondo, obtenerFondos} from "../controllers/FondoController.js"

const router = express.Router();

// Ejemplo sin middleware
// router.get("/login",login)

// Ejemplo con middleware
// router.get("/login",auth,login)

// Crear un nuevo fondo
router.post("/",crearFondo)
// Obtener todos los fondos
router.get("/",obtenerFondos)
// Obtener un fondo
router.get("/:id",obtenerFondo)
// Eliminar un fondo
router.delete("/:id")


export default router;
