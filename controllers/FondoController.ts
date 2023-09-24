import { Request, Response } from "express";
import { handleServerError } from "../helpers/handleServerError.js";

import {prisma} from "../index.js"

// Crear un fondo
export const crearFondo = async (req:Request,res:Response) =>{

    const {rendimientos,...data} = req.body
    

    try {

        const fondo = await prisma.fondo.create({
            data:{
                ...data,
                rendimiento:{
                    createMany:{
                        data:rendimientos
                        }
                }
            }
        })

        return res.json(fondo)
        
    } catch (error:any) {
        return handleServerError(error,"Fondo",res)
        
    }
}

// Obtener todos los fondos
export const obtenerFondos = async (_req:Request,res:Response) =>{
    try {
        const fondos = await prisma.fondo.findMany({
            include:{
                rendimiento:true
            }
        })

        return res.json(fondos)
        
    } catch (error:any) {
        return handleServerError(error,"Fondo",res)
        
    }
}

// Obtener un fondo

export const obtenerFondo = async (req:Request,res:Response) =>{
    const {id} = req.params
    try {
        const fondo = await prisma.fondo.findUnique({
            where:{
                id:Number(id)
            },
            include:{
                rendimiento:true
            }
        })

        return res.json(fondo)
        
    } catch (error:any) {
        return handleServerError(error,"Fondo",res)
        
    }
}

// Eliminar un fondo

export const eliminarFondo = async (req:Request,res:Response)=>{
    const {id} = req.params

    try {
        await prisma.fondo.delete({
            where:{
                id:Number(id)
            }
        })

        return res.json("Fondo eliminado correctamente")
    } catch (error:any) {
        return handleServerError(error,"Fondo",res)
    }
}