import { FilesValidationContext } from "./interfaces/files.interface.validation";

export function initFilesValidation(data: FilesValidationContext): boolean {
    if(!data.files || data.files.length === 0) {
        return true;
    }
    validateFilesMaxNumber(data.files, data.maxNumber);
    validateFilesType(data.files, data.types);
    validateFilesSizeEach(data.files, data.maxSize);
    return true;
}

export function validateFilesMaxNumber(files: Express.Multer.File[], max: number) {
    if(files.length > max) {
        throw new Error(`support-invalid-max#files!${max}`);
    }
}

export function validateFilesType(files: Express.Multer.File[], validTypes: string[]) {
    files.forEach((file: Express.Multer.File) => {
        if(!validTypes.includes(file.mimetype)) {
            throw new Error('support-files-mimetype');
        }
    })
}

export function validateFilesSizeEach(files: Express.Multer.File[], maxInMb: number) {
    const validSize = 1024 * 1024 * maxInMb;
    files.forEach((file: Express.Multer.File) => {
        if(file.size > validSize) {
            throw new Error('support-files-size-each');
        }
    })
}