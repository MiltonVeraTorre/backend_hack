import { Request } from "express";

import { Prisma } from "@prisma/client";
import { AdminInt, UserInt } from "./ModelTypes";



export interface ReqAdmin extends Request{
    admin ?: AdminInt
}
export interface ReqUser extends Request{
    
    user ?: UserInt
}


