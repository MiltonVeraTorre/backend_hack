import { handleServerError } from "../helpers/handleServerError.js";
import { prisma } from "../index.js";
export const crearFondo = async (req, res) => {
    const { rendimientos, ...data } = req.body;
    try {
        const fondo = await prisma.fondo.create({
            data: {
                ...data,
                rendimiento: {
                    createMany: {
                        data: rendimientos
                    }
                }
            }
        });
        return res.json(fondo);
    }
    catch (error) {
        return handleServerError(error, "Fondo", res);
    }
};
export const obtenerFondos = async (_req, res) => {
    try {
        const fondos = await prisma.fondo.findMany({
            include: {
                rendimiento: true
            }
        });
        return res.json(fondos);
    }
    catch (error) {
        return handleServerError(error, "Fondo", res);
    }
};
export const obtenerFondo = async (req, res) => {
    const { id } = req.params;
    try {
        const fondo = await prisma.fondo.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                rendimiento: true
            }
        });
        return res.json(fondo);
    }
    catch (error) {
        return handleServerError(error, "Fondo", res);
    }
};
export const eliminarFondo = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.fondo.delete({
            where: {
                id: Number(id)
            }
        });
        return res.json("Fondo eliminado correctamente");
    }
    catch (error) {
        return handleServerError(error, "Fondo", res);
    }
};
