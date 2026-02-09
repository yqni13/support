import { PutObjectCommand } from "@aws-sdk/client-s3";
import { CloudService } from "../../../src/services/cloud.service";
import { CloudUpload } from "../../../src/services/interfaces/cloud.interface.service"
import { secrets } from "../../../src/utils/secrets.utils";
import * as mockId from "../../mock-data/id.mock-data.json";
import * as CommonUtils from "../../../src/utils/common.utils";
import { UnexpectedApiResponseException } from "../../../src/utils/exceptions/api.exception";

jest.mock("@aws-sdk/client-s3", () => ({
    PutObjectCommand: jest.fn()
}));

describe('Service tests, class <CloudService>, priority: <upload>', () => {

    describe('Testing valid fn calls', () => {

        test('Call PutObjectCommand and send() with correct params', async () => {
            const mockParam_params: CloudUpload = {
                bucket: secrets.CLOUD_BUCKET,
                key: `tickets/${mockId.tickets.valid[0]}/0_${mockId.tickets.valid[0]}.webp`,
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

        test('Call send() and throw exception on mocked api error', async () => {
            const mockParam_params: CloudUpload = {
                bucket: secrets.CLOUD_BUCKET,
                key: `tickets/${mockId.tickets.valid[0]}/0_${mockId.tickets.valid[0]}.webp`,
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