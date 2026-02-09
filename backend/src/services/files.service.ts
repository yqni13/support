import { UnimplementedException } from "../utils/exceptions/api.exception";

export class FilesService {
    private _basePath: string;
    private _files: Express.Multer.File[];
    
    constructor(baseFiles: Express.Multer.File[]) {
        this._files = baseFiles;
        this._basePath = 'tickets';
    }

    transformFiles(ticketId: string) {
        this._files.forEach((file: Express.Multer.File, index: number) => {
            if(!file.originalname || file.originalname === '') {
                file.originalname = file.filename;
            }
            const fileType = this.convertTypeFromFilename(file.originalname);
            const name = `${index}_${ticketId}.${fileType}`;
            file.path = `${this._basePath}/${ticketId}/${name}`;
            file.filename = name;
            file.originalname = name;
        })
    }

    get files(): Express.Multer.File[] {
        return this._files;
    }

    convertTypeFromFilename(filename: string): string {
        return filename.substring(filename.indexOf('.')+1);
    }

    getResourcePaths(): string[] {
        let paths: string[] = [];
        this._files.forEach((file: Express.Multer.File) => {
            paths.push(file.path);
        })
        return paths;
    }

    async uploadFiles() {
        throw new UnimplementedException();
    }
}