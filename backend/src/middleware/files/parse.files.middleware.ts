import { Request, Response, NextFunction } from "express";
import { logError } from "../../utils/common.utils";
import multer from 'multer';

export function parseFiles() {
    const upload = multer({ storage: multer.memoryStorage() });
    
    return function(req: Request, res: Response, next: NextFunction) {
        upload.array('attachment')(req, res, (err: any) => {
            if(err) {
                err.status = err.status ?? 500;
                logError(
                    "PARSE MIDDLEWARE ERROR ON FILES",
                    "SUPPORT_middleware_parseFiles",
                    err
                );
                return next(err);
            }
            next();
        });
    }
}