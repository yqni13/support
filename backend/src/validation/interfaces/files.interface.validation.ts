import { Multer } from 'multer';

export interface FilesValidationContext {
    files?: Express.Multer.File[],
    maxNumber: number,
    maxSize: number,
    types: string[],
}