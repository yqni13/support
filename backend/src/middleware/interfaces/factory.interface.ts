import { Request, Response, NextFunction } from "express";

export type AsyncMiddleware = (req: Request, res: Response, next: NextFunction) => Promise<void>;