import { FilesTotalValidation } from "./interfaces/files.interface.validation";

export function validateFiles(data: FilesTotalValidation): boolean {
    if(data.required) {
        validateFilesRequired(data.files);
    }
    validateFilesMaxNumber(data.files, data.maxNumber);
    validateFilesType(data.files, data.types);
    validateFilesSingleSize(data.files, data.maxSize);
    return true;
}

export function validateFilesRequired(files: any[]) {
    if(files.length < 1) {
        throw new Error('support-files-required');
    }
}

export function validateFilesMaxNumber(files: any[], max: number) {
    if(files.length > max) {
        throw new Error(`support-invalid-max#files!${max}`);
    }
}

export function validateFilesType(files: any[], validTypes: string[]) {
    files.forEach((file: any) => {
        console.log("file: ", file);
        // TODO(yqni13): implementation missing
    })
}

export function validateFilesSingleSize(files: any[], validSizeInMb: number) {
    const validSize = 1024 * 1024 * validSizeInMb;
    // TODO(yqni13): implementation missing
}