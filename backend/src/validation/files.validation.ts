import { getPreCharString } from "../utils/common.utils";
import { InvalidFilesException } from "../utils/exceptions/validation.exception";
import { FilesValidationContext } from "./interfaces/files.interface.validation";

export function initFilesValidation(data: FilesValidationContext): boolean {
    if(!data.files || data.files.length === 0) {
        return true;
    }
    validateFilesMaxNumber(data.files, data.maxNumber);
    validateFilesNames(data.files);
    validateFilesType(data.files, data.types);
    validateFilesSizeEach(data.files, data.maxSizeInMb);
    return true;
}

export function validateFilesMaxNumber(files: Express.Multer.File[], max: number) {
    if(files.length > max) {
        throw new InvalidFilesException(`support-invalid-max#files!${max}`);
    }
}

export function validateFilesNames(files: Express.Multer.File[]) {
    files.forEach((file: Express.Multer.File) => {
        const origName = file.originalname ?? '';
        const fileName = file.filename ?? '';
        // Substring of pre-name also returns '' when no '.' found => '.jpg' and 'test-name' checks invalid.
        if((origName === '' || getPreCharString(origName, '.') === '')
        && (fileName === '' || getPreCharString(fileName, '.') === '')) {
            throw new InvalidFilesException('support-files-invalid-name');
        }
    })
}

export function validateFilesType(files: Express.Multer.File[], validTypes: string[]) {
    files.forEach((file: Express.Multer.File) => {
        if(!validTypes.includes(file.mimetype)) {
            throw new InvalidFilesException('support-files-mimetype');
        }
    })
}

export function validateFilesSizeEach(files: Express.Multer.File[], maxInMb: number) {
    const validSize = 1024 * 1024 * maxInMb;
    files.forEach((file: Express.Multer.File) => {
        if(file.size > validSize) {
            throw new InvalidFilesException('support-files-size-each');
        }
    })
}