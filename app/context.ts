import { PrismaClient } from "@prisma/client";
import { decodeAuthHeader } from "./utils/auth";   
import { Request } from "express";  
import { NexusGenObjects } from '../nexus-typegen';

export const prisma = new PrismaClient();

export interface Context {
    prisma: PrismaClient;
    user: NexusGenObjects['User'] | null;
}

export const context = ({ req }: { req: Request }): Context => {   // 2
    console.log('req', req.user)
    const token =
        req && req.headers.authorization
            ? decodeAuthHeader(req.headers.authorization)
            : null;
    
    return {  
        prisma,
        user: req.user, 
    };
};