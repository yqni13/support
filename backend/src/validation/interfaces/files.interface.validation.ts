export interface FilesValidationContext {
    files?: Express.Multer.File[],
    maxNumber: number,
    maxSizeInMb: number,
    types: string[],
}