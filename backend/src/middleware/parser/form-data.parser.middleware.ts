import { Request, Response, NextFunction } from "express";
import { logError } from "../../utils/common.utils";

export function parseFormData() {    
    return function(req: Request, res: Response, next: NextFunction) {
        try {
            if(req.body && req.body.data) {
                req.body = JSON.parse(req.body.data);
            }
            next();
        } catch(err: any) {
            err.status = !err.status ? 404 : err.status;
            logError(
                "PARSE MIDDLEWARE ERROR ON FORM DATA",
                "SUPPORT_middleware_parseFormData",
                err
            );
            next(err);
        }
    }
}