import { FilesService } from "../../../src/services/files.service"
import { UnexpectedApiResponseException } from "../../../src/utils/exceptions/api.exception";
import * as mockId from "../../mock-data/id.mock-data.json";
import { Readable } from 'stream';
import { secrets } from "../../../src/utils/secrets.utils";

// Necessary to have class CloudService as jest.fn at runtime => otherwise mockImplementation() does not exist.
jest.mock("../../../src/services/cloud.service.ts", () => {
    return { CloudService: jest.fn() }
})

import { CloudService } from "../../../src/services/cloud.service";

const basePath = 'tickets';

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

        test('Transform files by id, params: <id>', () => {
            const mockParam_id = mockId.tickets.new[0];
            const filesService = new FilesService(mockFiles, basePath);
            filesService.transformFiles(mockParam_id);
            const mockResult = filesService.files;
            const comparePartialResults: Partial<Express.Multer.File>[] = [
                {
                    originalname: `0_${mockParam_id}.webp`,
                    filename: `0_${mockParam_id}.webp`,
                    path: `tickets/${mockParam_id}/0_${mockParam_id}.webp`,
                },
                {
                    originalname: `1_${mockParam_id}.webp`,
                    filename: `1_${mockParam_id}.webp`,
                    path: `tickets/${mockParam_id}/1_${mockParam_id}.webp`,
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

describe('Service tests, class <FilesService>, priority: <getResourcePaths>', () => {

    let mockFiles: Express.Multer.File[];
    beforeEach(() => {
        mockFiles = [
            {
                fieldname: '',
                originalname: `0_${mockId.tickets.new[0]}.webp`,
                encoding: '7bit',
                mimetype: 'image/webp',
                size: 377592, // 368kb
                destination: '',
                filename: `0_${mockId.tickets.new[0]}.webp`,
                path: `tickets/${mockId.tickets.new[0]}/0_${mockId.tickets.new[0]}.webp`,
                buffer: Buffer.from([0x52,0x49,0x46,0x46,0x24,0x00,0x00,0x00,0x57,0x45,0x42,0x50]),
                stream: Readable.from(Buffer.from('RIFF...WEBP'))
            },
            {
                fieldname: '',
                originalname: `1_${mockId.tickets.new[0]}.webp`,
                encoding: '7bit',
                mimetype: 'image/webp',
                size: 218632, // 213kb
                destination: '',
                filename: `1_${mockId.tickets.new[0]}.webp`,
                path: `tickets/${mockId.tickets.new[0]}/1_${mockId.tickets.new[0]}.webp`,
                buffer: Buffer.from([0x52,0x49,0x46,0x46,0x24,0x00,0x00,0x00,0x57,0x45,0x42,0x50]),
                stream: Readable.from(Buffer.from('RIFF...WEBP'))
            }
        ];
    })

    describe('Testing valid fn calls', () => {

        test('Get paths from multiple files', () => {
            const filesService = new FilesService(mockFiles, basePath);
            const testFn = filesService.getResourcePaths();
            const mockResult = [mockFiles[0].path, mockFiles[1].path];

            expect(testFn).toStrictEqual(mockResult);
        })
    })
})

describe('Service tests, class <FilesService>, priority: <uploadFiles>', () => {

    let mockFiles: Express.Multer.File[] = [];
    let mockUploadFn: jest.Mock;
    beforeEach(() => {
        mockFiles = [
            {
                fieldname: 'test-image',
                originalname: `0_${mockId.tickets.new[0]}.webp`,
                encoding: '7bit',
                mimetype: 'image/webp',
                size: 210855, // 205kb
                destination: '',
                filename: `0_${mockId.tickets.new[0]}.webp`,
                path: `tickets/${mockId.tickets.new[0]}/0_${mockId.tickets.new[0]}.webp`,
                buffer: Buffer.from([0x52,0x49,0x46,0x46,0x24,0x00,0x00,0x00,0x57,0x45,0x42,0x50]),
                stream: Readable.from(Buffer.from('RIFF...WEBP'))
            },
            {
                fieldname: 'test-image',
                originalname: `1_${mockId.tickets.new[0]}.webp`,
                encoding: '7bit',
                mimetype: 'image/webp',
                size: 377592, // 368kb
                destination: '',
                filename: `1_${mockId.tickets.new[0]}.webp`,
                path: `tickets/${mockId.tickets.new[0]}/1_${mockId.tickets.new[0]}.webp`,
                buffer: Buffer.from([0x52,0x49,0x46,0x46,0x24,0x00,0x00,0x00,0x57,0x45,0x42,0x50]),
                stream: Readable.from(Buffer.from('RIFF...WEBP'))
            }
        ];
        mockUploadFn = jest.fn().mockResolvedValue(undefined);
        (CloudService as jest.Mock).mockImplementation(() => ({ upload: mockUploadFn }));
    })
    afterEach(() => {
        jest.clearAllMocks();
    })

    describe('Testing valid fn calls', () => {

        test('Upload all files, params: <files>.lenght = 2, result: "SUCCESS"', async () => {
            const filesService = new FilesService(mockFiles, basePath);
            await expect(filesService.uploadFiles()).resolves.toBeUndefined();
            expect(mockUploadFn).toHaveBeenCalledTimes(mockFiles.length)
            expect(mockUploadFn).toHaveBeenNthCalledWith(1, {
                bucket: secrets.CLOUD_BUCKET,
                key: mockFiles[0].path,
                buffer: mockFiles[0].buffer,
                contentType: mockFiles[0].mimetype
            })
            expect(mockUploadFn).toHaveBeenNthCalledWith(2, {
                bucket: secrets.CLOUD_BUCKET,
                key: mockFiles[1].path,
                buffer: mockFiles[1].buffer,
                contentType: mockFiles[1].mimetype
            })
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Upload all files, params: <files>.length = 2, result: "ERROR"', async () => {
            const filesService = new FilesService(mockFiles, basePath);
            mockUploadFn
                .mockResolvedValue(undefined) // Simulate 1st file upload to be success.
                .mockRejectedValue(new UnexpectedApiResponseException()); // Simulate 2nd file upload to be error.
            await expect(filesService.uploadFiles()).rejects.toThrow('support-invalid-api');
            expect(mockUploadFn).toHaveBeenCalledTimes(2);
        })
    })
})