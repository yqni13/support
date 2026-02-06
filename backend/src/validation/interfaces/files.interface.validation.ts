export interface FilesValidationContext {
    files: any[],
    required: boolean,
    maxNumber: number,
    maxSize: number,
    types: string[],
}