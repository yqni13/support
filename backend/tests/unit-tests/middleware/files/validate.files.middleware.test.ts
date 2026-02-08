import { InvalidFilesException } from './../../../../src/utils/exceptions/validation.exception';
import { Readable } from 'stream';
import { validateFiles } from '../../../../src/middleware/files/validate.files.middleware';
import { ErrorStatusCodes } from '../../../../src/utils/errorStatusCodes.utils';

describe('Middleware tests category <files>, priority: validateFiles', () => {

    const req: any = {};
    const res: any = {};
    const next = jest.fn();
    let mockFile_webp: Express.Multer.File;
    beforeEach(() => {
        mockFile_webp = {
            fieldname: 'test-image',
            originalname: 'test-image.webp',
            encoding: '7bit',
            mimetype: 'image/webp',
            size: 0,
            destination: '',
            filename: 'test-image.webp',
            path: '',
            buffer: Buffer.from([0x52,0x49,0x46,0x46,0x24,0x00,0x00,0x00,0x57,0x45,0x42,0x50]),
            stream: Readable.from(Buffer.from('RIFF...WEBP'))
        };
        jest.clearAllMocks();
    })
    afterEach(() => {
        jest.restoreAllMocks();
    })

    describe('Testing valid fn calls', () => {

        test('Validate files, params: single valid file', async () => {
            const mockFile = mockFile_webp;
            mockFile.size = 377592; // 368KB
            req.files = [mockFile];

            const middleware = validateFiles();
            await middleware(req, res, next);

            expect(next).toHaveBeenCalledWith();
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Validate files, params: single invalid file', async () => {
            const mockFile = mockFile_webp;
            mockFile.size = 1810655; // 1.72MB
            req.files = [mockFile];

            const middleware = validateFiles();
            await middleware(req, res, next);

            const errArg = next.mock.calls[0][0];
            expect(errArg).toBeInstanceOf(InvalidFilesException);
            expect(errArg.status).toBe(ErrorStatusCodes.InvalidFilesException);
            expect(errArg.message).toBe('support-files-size-each');
        })
    })
})