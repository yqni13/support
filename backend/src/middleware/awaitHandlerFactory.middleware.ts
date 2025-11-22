import { RequestHandler } from "express";
import { AsyncMiddleware } from "../utils/custom-types.utils";

export function awaitHandlerFactory(middleware: AsyncMiddleware): RequestHandler {
    return async (req, res, next) => {
        try {
            await middleware(req, res, next);
        } catch (err: any) {
            next(err);
        }
    };
};