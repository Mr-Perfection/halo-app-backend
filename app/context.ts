import { PrismaClient } from "@prisma/client";
import { decodeAuthHeader } from "./utils/auth";   
import { Request, Response } from "express";  
import { NexusGenObjects } from '../nexus-typegen';

export const prisma = new PrismaClient();

export interface Context {
    prisma: PrismaClient;
    req: Request;
    res: Response;
}

export const context = ({ req, res }: { req: Request, res: Response }): Context => {
    return {  
        prisma,
        req, 
        res,
    };
};