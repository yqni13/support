export interface CloudUpload {
    bucket: string,
    key: string,
    buffer: Buffer,
    contentType: string
}