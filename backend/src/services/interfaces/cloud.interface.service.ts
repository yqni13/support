export interface CloudUploadContext {
    bucket: string,
    key: string,
    buffer: Buffer,
    contentType: string
}

export interface CloudDeleteContext {
    bucket: string,
    keys: Record<'Key', string>[]
}