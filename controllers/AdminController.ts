import { Response } from "express";
import { ReqAdmin } from "../types/GeneralTypes";


export const login = async (_req:ReqAdmin,res:Response) =>{
    return res.json("Login!");
}