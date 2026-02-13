import { DeleteObjectsCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { CloudService } from "../../../src/services/cloud.service";
import { CloudDeleteContext, CloudUploadContext } from "../../../src/services/interfaces/cloud.interface.service"
import { secrets } from "../../../src/utils/secrets.utils";
import * as mockId from "../../mock-data/id.mock-data.json";
import * as CommonUtils from "../../../src/utils/common.utils";
import { UnexpectedApiResponseException } from "../../../src/utils/exceptions/api.exception";

jest.mock("@aws-sdk/client-s3", () => ({
    PutObjectCommand: jest.fn(),
    DeleteObjectsCommand: jest.fn()
}));

describe('Service tests, class <CloudService>, priority: <upload>', () => {

    describe('Testing valid fn calls', () => {

        test('Call PutObjectCommand and send() with correct params', async () => {
            const mockParam_params: CloudUploadContext = {
                bucket: secrets.CLOUD_BUCKET,
                key: `tickets/${mockId.tickets.new[0]}/0_${mockId.tickets.new[0]}.webp`,
                buffer: Buffer.from([0x52,0x49,0x46,0x46,0x24,0x00,0x00,0x00,0x57,0x45,0x42,0x50]),
                contentType: 'image/webp'
            };
            const cloudService = new CloudService();
            const mockSendFn = jest.fn().mockResolvedValue(undefined);
            jest.spyOn(cloudService as any, 'getR2Client').mockReturnValue({send: mockSendFn});

            await cloudService.upload(mockParam_params);

            expect(PutObjectCommand).toHaveBeenCalledTimes(1);
            expect(PutObjectCommand).toHaveBeenCalledWith({
                Bucket: mockParam_params.bucket,
                Key: mockParam_params.key,
                Body: mockParam_params.buffer,
                ContentType: mockParam_params.contentType
            });
            expect(mockSendFn).toHaveBeenCalledTimes(1);
            expect(mockSendFn).toHaveBeenCalledWith(expect.any(PutObjectCommand as any));
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Call PutObjectCommand and send() to throw exception on mocked api error', async () => {
            const mockParam_params: CloudUploadContext = {
                bucket: secrets.CLOUD_BUCKET,
                key: `tickets/${mockId.tickets.new[0]}/0_${mockId.tickets.new[0]}.webp`,
                buffer: Buffer.from([0x52,0x49,0x46,0x46,0x24,0x00,0x00,0x00,0x57,0x45,0x42,0x50]),
                contentType: 'image/webp'
            };
            const cloudService = new CloudService();
            const mockSendFn = jest.fn().mockResolvedValue(undefined);
            const mockError = new Error('test-error');

            jest.spyOn(cloudService as any, 'getR2Client').mockReturnValue({send: mockSendFn});
            jest.spyOn(CommonUtils, 'logError').mockImplementation();
            mockSendFn.mockRejectedValueOnce(mockError);

            await expect(cloudService.upload(mockParam_params))
                .rejects
                .toBeInstanceOf(UnexpectedApiResponseException);
            expect(mockSendFn).toHaveBeenCalledTimes(1);
        })
    })
})

describe('Service tests, class <CloudService>, priority: <delete>', () => {

    let mockParam_params: CloudDeleteContext;
    beforeEach(() => {
        mockParam_params = {
            bucket: secrets.CLOUD_BUCKET,
            keys: [{ Key: `tickets/${mockId.tickets.new[0]}/0_${mockId.tickets.new[0]}.webp` }],
        };
    })

    describe('Testing valid fn calls', () => {

        test('Call DeleteObjectsCommand and send() with correct params', async () => {
            const cloudService = new CloudService();
            const mockSendFn = jest.fn().mockResolvedValue(undefined);
            jest.spyOn(cloudService as any, 'getR2Client').mockReturnValue({send: mockSendFn});

            await cloudService.delete(mockParam_params);

            expect(DeleteObjectsCommand).toHaveBeenCalledTimes(1);
            expect(DeleteObjectsCommand).toHaveBeenCalledWith({
                Bucket: mockParam_params.bucket,
                Delete: { Objects: mockParam_params.keys }
            });
            expect(mockSendFn).toHaveBeenCalledTimes(1);
            expect(mockSendFn).toHaveBeenCalledWith(expect.any(DeleteObjectsCommand as any));
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Call DeleteObjectsCommand and send() to throw exception on mocked api error', async () => {
            const cloudService = new CloudService();
            const mockSendFn = jest.fn().mockResolvedValue(undefined);
            const mockError = new Error('test-error');

            jest.spyOn(cloudService as any, 'getR2Client').mockReturnValue({send: mockSendFn});
            jest.spyOn(CommonUtils, 'logError').mockImplementation();
            mockSendFn.mockRejectedValueOnce(mockError);

            await expect(cloudService.delete(mockParam_params))
                .rejects
                .toBeInstanceOf(UnexpectedApiResponseException);
            expect(mockSendFn).toHaveBeenCalledTimes(1);
        })
    })
})