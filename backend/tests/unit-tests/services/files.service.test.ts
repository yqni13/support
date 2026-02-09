import { FilesService } from "../../../src/services/files.service"
import * as mockId from "../../mock-data/id.mock-data.json";
import { Readable } from 'stream';

describe('Service tests, class <FilesService>, priority: <transformFiles>', () => {

    let mockFiles: Express.Multer.File[];
    beforeEach(() => {
        mockFiles = [
            {
                fieldname: '',
                originalname: 'test-image1.webp',
                encoding: '7bit',
                mimetype: 'image/webp',
                size: 377592, // 368kb
                destination: '',
                filename: 'test-image1.webp',
                path: '',
                buffer: Buffer.from([0x52,0x49,0x46,0x46,0x24,0x00,0x00,0x00,0x57,0x45,0x42,0x50]),
                stream: Readable.from(Buffer.from('RIFF...WEBP'))
            },
            {
                fieldname: '',
                originalname: 'test-image2.webp',
                encoding: '7bit',
                mimetype: 'image/webp',
                size: 218632, // 213kb
                destination: '',
                filename: 'test-image2.webp',
                path: '',
                buffer: Buffer.from([0x52,0x49,0x46,0x46,0x24,0x00,0x00,0x00,0x57,0x45,0x42,0x50]),
                stream: Readable.from(Buffer.from('RIFF...WEBP'))
            }
        ];
    })

    describe('Testing valid fn calls', () => {

        test('Transform files by id, params: <ticketId>', () => {
            const mockParam_ticketId = mockId.tickets.valid[0];
            const filesService = new FilesService(mockFiles);
            filesService.transformFiles(mockParam_ticketId);
            const mockResult = filesService.files;
            const comparePartialResults: Partial<Express.Multer.File>[] = [
                {
                    originalname: `0_${mockParam_ticketId}.webp`,
                    filename: `0_${mockParam_ticketId}.webp`,
                    path: `tickets/${mockParam_ticketId}/0_${mockParam_ticketId}.webp`,
                },
                {
                    originalname: `1_${mockParam_ticketId}.webp`,
                    filename: `1_${mockParam_ticketId}.webp`,
                    path: `tickets/${mockParam_ticketId}/1_${mockParam_ticketId}.webp`,
                }
            ];

            expect([
                mockResult[0].originalname,
                mockResult[0].filename,
                mockResult[0].path,
                mockResult[1].originalname,
                mockResult[1].filename,
                mockResult[1].path
            ]).toStrictEqual([
                comparePartialResults[0].originalname,
                comparePartialResults[0].filename,
                comparePartialResults[0].path,
                comparePartialResults[1].originalname,
                comparePartialResults[1].filename,
                comparePartialResults[1].path,
            ]);
        })
    })
})

describe('Service tests, class <FilesService>, priority: <convertTypeFromFilename>', () => {

    let mockFile: Express.Multer.File[];
    beforeEach(() => {
        mockFile = [{
            fieldname: 'test-image',
            originalname: 'test-image.webp',
            encoding: '7bit',
            mimetype: 'image/webp',
            size: 377592, // 368KB
            destination: '',
            filename: 'test-image.webp',
            path: '',
            buffer: Buffer.from([0x52,0x49,0x46,0x46,0x24,0x00,0x00,0x00,0x57,0x45,0x42,0x50]),
            stream: Readable.from(Buffer.from('RIFF...WEBP'))
        }];
    })

    describe('Testing valid fn calls', () => {

        test('Convert type from filename, params: <filename>', () => {
            const mockParam_filename = 'test-filename+1y.webp';
            const filesService = new FilesService(mockFile);
            const testFn = filesService.convertTypeFromFilename(mockParam_filename);
            const mockResult = 'webp';

            expect(testFn).toBe(mockResult);
        })
    })
})

describe('Service tests, class <FilesService>, priority: <getResourcePaths>', () => {

    let mockFiles: Express.Multer.File[];
    beforeEach(() => {
        mockFiles = [
            {
                fieldname: '',
                originalname: `0_${mockId.tickets.valid[0]}.webp`,
                encoding: '7bit',
                mimetype: 'image/webp',
                size: 377592, // 368kb
                destination: '',
                filename: `0_${mockId.tickets.valid[0]}.webp`,
                path: `tickets/${mockId.tickets.valid[0]}/0_${mockId.tickets.valid[0]}.webp`,
                buffer: Buffer.from([0x52,0x49,0x46,0x46,0x24,0x00,0x00,0x00,0x57,0x45,0x42,0x50]),
                stream: Readable.from(Buffer.from('RIFF...WEBP'))
            },
            {
                fieldname: '',
                originalname: `1_${mockId.tickets.valid[0]}.webp`,
                encoding: '7bit',
                mimetype: 'image/webp',
                size: 218632, // 213kb
                destination: '',
                filename: `1_${mockId.tickets.valid[0]}.webp`,
                path: `tickets/${mockId.tickets.valid[0]}/1_${mockId.tickets.valid[0]}.webp`,
                buffer: Buffer.from([0x52,0x49,0x46,0x46,0x24,0x00,0x00,0x00,0x57,0x45,0x42,0x50]),
                stream: Readable.from(Buffer.from('RIFF...WEBP'))
            }
        ];
    })

    describe('Testing valid fn calls', () => {

        test('Get paths from multiple files', () => {
            const filesService = new FilesService(mockFiles);
            const testFn = filesService.getResourcePaths();
            const mockResult = [mockFiles[0].path, mockFiles[1].path];

            expect(testFn).toStrictEqual(mockResult);
        })
    })
})