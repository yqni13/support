import { secrets } from "../utils/secrets.utils";
import { S3Client, PutObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { CloudDeleteContext, CloudUploadContext } from "./interfaces/cloud.interface.service";
import { logError } from "../utils/common.utils";
import { UnexpectedApiResponseException } from "../utils/exceptions/api.exception";

export class CloudService {
    constructor() {
        //
    }

    private getR2Client(): S3Client {
        return new S3Client({
            region: 'auto',
            endpoint: secrets.CLOUD_ENDPOINT,
            credentials: {
                accessKeyId: secrets.CLOUD_ACCESS_KEY_ID,
                secretAccessKey: secrets.CLOUD_SECRET_KEY
            }
        })
    }

    async upload(params: CloudUploadContext) {
        try {
            const r2Client = this.getR2Client();
            const command = new PutObjectCommand({
                Bucket: params.bucket,
                Key: params.key,
                Body: params.buffer,
                ContentType: params.contentType
            });
            await r2Client.send(command);
        } catch(err: any) {
            err.status = err.status ?? 502; // For logging only.
            logError(
                "CLOUD SERVICE ERROR ON UPLOAD",
                err.message ?? "SUPPORT_CloudService_upload",
                err
            );
            throw new UnexpectedApiResponseException();
        }
    }

    async delete(params: CloudDeleteContext) {
        try {
            const r2Client = this.getR2Client();
            const command = new DeleteObjectsCommand({
                Bucket: params.bucket,
                Delete: {
                    Objects: params.keys
                }
            });
            await r2Client.send(command);
        } catch(err: any) {
            err.status = err.status ?? 502; // For logging only.
            logError(
                "CLOUD SERVICE ERROR ON DELETE",
                err.message ?? "SUPPORT_CloudService_delete",
                err
            );
            throw new UnexpectedApiResponseException();
        }
    }
}