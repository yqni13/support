import { getPostCharString } from "../utils/common.utils";
import { CloudService } from "./cloud.service";
import { secrets } from "../utils/secrets.utils";
import { CloudDeleteContext } from "./interfaces/cloud.interface.service";

export class FilesService {
    private _basePath: string;
    private _files: Express.Multer.File[];
    private _cloudService: CloudService;
    
    constructor(baseFiles: Express.Multer.File[], basePath: string) {
        this._files = baseFiles;
        this._basePath = basePath;
        this._cloudService = new CloudService();
    }

    transformFiles(id: string) {
        this._files.forEach((file: Express.Multer.File, index: number) => {
            if(!file.originalname || file.originalname === '') {
                file.originalname = file.filename;
            }
            const fileType = getPostCharString(file.originalname, '.');
            const name = `${index}_${id}.${fileType}`;
            file.path = `${this._basePath}/${id}/${name}`;
            file.filename = name;
            file.originalname = name;
        })
    }

    get files(): Express.Multer.File[] {
        return this._files;
    }

    getResourcePaths(): string[] {
        return this._files.map((file: Express.Multer.File) => file.path);
    }

    async uploadFiles() {
        await Promise.all(
            this._files.map(file => 
                this._cloudService.upload({
                    bucket: secrets.CLOUD_BUCKET,
                    key: file.path,
                    buffer: file.buffer,
                    contentType: file.mimetype
                })
            )
        );
    }

    async deleteFiles(paths: string[]) {
        const keyArr: Record<'Key', string>[] = paths.map((path: string) => ({ Key: path }));
        const params: CloudDeleteContext = {
            bucket: secrets.CLOUD_BUCKET,
            keys: keyArr
        };
        await this._cloudService.delete(params);
    }
}