import express from "express";
import {crearEstrategia, elegirEstrategia, obtenerEstrategias} from "../controllers/EstrategiaController.js"

const router = express.Router();

// Ejemplo sin middleware
// router.get("/login",login)

// Ejemplo con middleware
// router.get("/login",auth,login)

// Proponer una nueva estrategia
router.post("/",crearEstrategia)
// Obtener todas las estrategias
router.get("/",obtenerEstrategias)
// Aprobar una estrategia
router.get("/elegir/:id",elegirEstrategia)
// Obtener una estrategia
router.get("/:id")
// Eliminar una estrategia
router.delete("/:id")


export default router;
