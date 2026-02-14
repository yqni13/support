import * as FileValidators from '../../../src/validation/files.validation';
import { Readable } from 'stream';

describe('Unit-tests (validation), priority: synonym FileValidators', () => {

    let mockFile_pdf: Express.Multer.File;
    let mockFile_webp: Express.Multer.File;
    let mockFile_mp4: Express.Multer.File;
    let mockFile_zip: Express.Multer.File;
    let mockFile_docx: Express.Multer.File;
    beforeEach(() => {
        mockFile_pdf = {
            fieldname: 'test-pdf',
            originalname: 'test-pdf.pdf',
            encoding: '7bit',
            mimetype: 'application/pdf',
            size: 218632, // 213kb
            destination: '',
            filename: 'test-pdf.pdf',
            path: '',
            buffer: Buffer.from([0x25, 0x50, 0x44, 0x46]),
            stream: Readable.from(Buffer.from('test pdf content'))
        };
        mockFile_webp = {
            fieldname: 'test-image',
            originalname: 'test-image.webp',
            encoding: '7bit',
            mimetype: 'image/webp',
            size: 377592, // 368kb
            destination: '',
            filename: 'test-image.webp',
            path: '',
            buffer: Buffer.from([0x52,0x49,0x46,0x46,0x24,0x00,0x00,0x00,0x57,0x45,0x42,0x50]),
            stream: Readable.from(Buffer.from('RIFF...WEBP'))
        };
        mockFile_mp4 = {
            fieldname: 'test-video',
            originalname: 'test-video.mp4',
            encoding: '7bit',
            mimetype: 'video/mp4',
            size: 904438, // 883kb
            destination: '',
            filename: 'test-video.mp4',
            path: '',
            buffer: Buffer.from([0x00,0x00,0x00,0x18,0x66,0x74,0x79,0x70,0x6d,0x70,0x34,0x32]),
            stream: Readable.from(Buffer.from('....ftypmp42'))
        };
        mockFile_zip = {
            fieldname: 'test-compress',
            originalname: 'test-compress.zip',
            encoding: '7bit',
            mimetype: 'application/x-zip-compressed',
            size: 210855, // 205kb
            destination: '',
            filename: 'test-compress.zip',
            path: '',
            buffer: Buffer.from([0x50,0x4b,0x03,0x04]),
            stream: Readable.from(Buffer.from('PK\x03\x04'))
        };
        mockFile_docx = {
            fieldname: 'test-document',
            originalname: 'test-document.docx',
            encoding: '7bit',
            mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            size: 31855, // 31kb
            destination: '',
            filename: 'test-document.docx',
            path: '',
            buffer: Buffer.from([0x50,0x4b,0x03,0x04]),
            stream: Readable.from(Buffer.from('PK\x03\x04')),
        };
    })
    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('fn validateFilesMaxNumber()', () => {

        describe('Testing valid fn calls', () => {

            test('Params: <files>.length = 2, <max> = 3', () => {
                const mockParam_files = [mockFile_pdf, mockFile_webp];
                const mockParam_max = 3;
                expect(() => FileValidators.validateFilesMaxNumber(
                    mockParam_files, mockParam_max
                )).not.toThrow();
            })

            test('Params: <files>.length = 2, <max> = 2', () => {
                const mockParam_files = [mockFile_pdf, mockFile_webp];
                const mockParam_max = 2;
                expect(() => FileValidators.validateFilesMaxNumber(
                    mockParam_files, mockParam_max
                )).not.toThrow();
            })
        })

        describe('Testing invalid fn calls', () => {

            test('Params: <files>.length = 2, <max> = 1', () => {
                const mockParam_files = [mockFile_pdf, mockFile_webp];
                const mockParam_max = 1;
                const mockError = `support-invalid-max#files!${mockParam_max}`;
                expect(() => FileValidators.validateFilesMaxNumber(
                    mockParam_files, mockParam_max
                )).toThrow(mockError);
            })
        })
    })

    describe('fn validateFilesNames()', () => {

        describe('Testing valid fn calls', () => {

            test('Params: <files>.length = 1, valid names', () => {
                const mockParam_files = [mockFile_webp];
                expect(() => FileValidators.validateFilesNames(mockParam_files)).not.toThrow();
            })
        })

        describe('Testing invalid fn calls', () => {

            test('Params: <files>.length = 1, invalid names with missing pre-name', () => {
                const mockParam_files = [mockFile_webp];
                mockParam_files[0].originalname = '.jpg';
                mockParam_files[0].filename = '';
                const mockError = 'support-files-invalid-name';
                expect(() => FileValidators.validateFilesNames(mockParam_files)).toThrow(mockError);
            })

            test('Params: <files>.length = 1, invalid names with min 1 empty string', () => {
                const mockParam_files = [mockFile_webp];
                mockParam_files[0].originalname = 'test-file';
                mockParam_files[0].filename = '';
                const mockError = 'support-files-invalid-name';
                expect(() => FileValidators.validateFilesNames(mockParam_files)).toThrow(mockError);
            })

            test('Params: <files>.length = 1, invalid names with missing "." and type', () => {
                const mockParam_files = [mockFile_webp];
                mockParam_files[0].originalname = 'test-file';
                mockParam_files[0].filename = '.jpg';
                const mockError = 'support-files-invalid-name';
                expect(() => FileValidators.validateFilesNames(mockParam_files)).toThrow(mockError);
            })
        })
    })

    describe('fn validateFilesType()', () => {

        let mockParam_validTypes: string[];
        beforeEach(() => {
            mockParam_validTypes = [
                'image/png',
                'image/webp',
                'image/jpeg',
                'application/pdf'
            ];
        })

        describe('Testing valid fn calls', () => {

            test('Params: <files>.length = 1, valid file type', () => {
                const mockParam_files = [mockFile_pdf];
                expect(() => FileValidators.validateFilesType(
                    mockParam_files, mockParam_validTypes
                )).not.toThrow();
            })

            test('Params: <files>.length = 2, valid file types', () => {
                const mockParam_files = [mockFile_pdf, mockFile_webp];
                expect(() => FileValidators.validateFilesType(
                    mockParam_files, mockParam_validTypes
                )).not.toThrow();
            })
        })

        describe('Testing invalid fn calls', () => {

            test('Params: <files>.length = 2, both invalid types', () => {
                const mockParam_files = [mockFile_docx, mockFile_mp4];
                const mockError = 'support-files-mimetype';
                expect(() => FileValidators.validateFilesType(
                    mockParam_files, mockParam_validTypes
                )).toThrow(mockError);
            })

            test('Params: <files>.length = 2, single invalid type', () => {
                const mockParam_files = [mockFile_pdf, mockFile_zip];
                const mockError = 'support-files-mimetype';
                expect(() => FileValidators.validateFilesType(
                    mockParam_files, mockParam_validTypes
                )).toThrow(mockError);
            })
        })
    })

    describe('fn validateFilesSizeEach()', () => {

        describe('Testing valid fn calls', () => {

            test('Params: <files>.length = 1, valid file size', () => {
                const mockParam_files = [mockFile_pdf];
                const mockParam_maxInMb = 1;
                expect(() => FileValidators.validateFilesSizeEach(
                    mockParam_files, mockParam_maxInMb
                )).not.toThrow();
            })

            test('Params: <files>.length = 2, valid file sizes', () => {
                const mockParam_files = [mockFile_webp, mockFile_pdf];
                const mockParam_maxInMb = 1;
                expect(() => FileValidators.validateFilesSizeEach(
                    mockParam_files, mockParam_maxInMb
                )).not.toThrow();
            })
        })

        describe('Testing invalid fn calls', () => {

            test('Params: <files>.length = 2, single invalid file size', () => {
                const mockParam_files = [mockFile_webp, mockFile_pdf];
                mockParam_files[1].size = 1088782; // 1.03MB
                const mockParam_maxInMb = 1;
                const mockError = 'support-files-size-each';
                expect(() => FileValidators.validateFilesSizeEach(
                    mockParam_files, mockParam_maxInMb
                )).toThrow(mockError);
            })

            test('Params: <files>.length = 2, invalid file size', () => {
                const mockParam_files = [mockFile_webp, mockFile_pdf];
                mockParam_files[0].size = 1088782; // 1.03MB
                mockParam_files[1].size = 1810655; // 1.72MB
                const mockParam_maxInMb = 1;
                const mockError = 'support-files-size-each';
                expect(() => FileValidators.validateFilesSizeEach(
                    mockParam_files, mockParam_maxInMb
                )).toThrow(mockError);
            })
        })
    })
})