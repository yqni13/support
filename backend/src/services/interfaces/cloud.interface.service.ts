export interface CloudUploadContext {
    bucket: string,
    key: string,
    buffer: Buffer,
    contentType: string
}