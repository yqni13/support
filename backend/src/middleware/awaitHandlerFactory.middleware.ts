import { RequestHandler } from "express";
import { AsyncMiddleware } from "./interfaces/factory.interface";

export function awaitHandlerFactory(middleware: AsyncMiddleware): RequestHandler {
    return async (req, res, next) => {
        try {
            await middleware(req, res, next);
        } catch (err: any) {
            next(err);
        }
    };
};