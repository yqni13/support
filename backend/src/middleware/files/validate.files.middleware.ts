import { NextFunction, Request, Response } from "express";
import * as FileValidators from '../../validation/files.validation';
import { FilesValidationContext } from "../../validation/interfaces/files.interface.validation";

export function validateFiles() {
    return async function(req: Request, res: Response, next: NextFunction) {
        try {
            const allowedMimetypes: string[] = [
                'application/pdf',
                'image/webp',
                'image/jpeg', // .jpe, .jpeg, .jpg, .pjpg, .jfif, .jfif-tbnl, .jif
                'image/png'
            ];
            const params: FilesValidationContext = {
                files: req.files as Express.Multer.File[] ?? undefined,
                maxNumber: 5,
                maxSizeInMb: 1,
                types: allowedMimetypes
            };

            FileValidators.initFilesValidation(params);
            next();
        } catch(err: any) {
            next(err);
        }
    }
}