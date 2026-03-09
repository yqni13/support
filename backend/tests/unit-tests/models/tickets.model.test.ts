import { TicketsCreateDTO, TicketsResponseDTO, TicketsUpdateDTO } from "../../../src/dtos/tickets.dto";
import * as CommonUtils from "../../../src/utils/common.utils";
import * as mockId from "../../mock-data/id.mock-data.json";
import { TicketStatus } from "../../../src/utils/enums/ticket-status.enum";
import { Tickets, TicketsId } from "../../../src/repositories/interfaces/tickets.entity.interface";
import ticketsModel from "../../../src/models/tickets.model";
import { Readable } from 'stream';
import { FilesService } from "../../../src/services/files.service";
import { TicketOption } from "../../../src/utils/enums/ticket-option.enum";
import { PermissionException } from "../../../src/utils/exceptions/auth.exception";
import { ClientsId } from "../../../src/repositories/interfaces/clients.entity.interface";
import { UsersId } from "../../../src/repositories/interfaces/users.entity.interface";

const mockValidTicketId = mockId.tickets.valid[0] as TicketsId;
const mockValidClientId = mockId.clients.valid[0] as ClientsId;
const mockValidUserId = mockId.users.valid[0] as UsersId;
const mockTimestamp = '2025-01-01T14:00:04.000Z';

describe('Unit-tests (model), priority: entity Tickets', () => {

    describe('Priority: fn generateTicketEntity()', () => {
    
        let mockFile_pdf: Express.Multer.File;
        let mockFile_webp: Express.Multer.File;
        beforeEach(() => {
            mockFile_pdf = {
                fieldname: 'test-pdf',
                originalname: 'test-pdf.pdf',
                encoding: '7bit',
                mimetype: 'application/pdf',
                size: 218632, // 213KB
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
                size: 377592, // 368KB
                destination: '',
                filename: 'test-image.webp',
                path: '',
                buffer: Buffer.from([0x52,0x49,0x46,0x46,0x24,0x00,0x00,0x00,0x57,0x45,0x42,0x50]),
                stream: Readable.from(Buffer.from('RIFF...WEBP'))
            };
        });
        afterEach(() => {
            jest.restoreAllMocks();
        });

        describe('Testing valid fn calls', () => {

            test('Generate new object, priority: no files', async () => {
                const mockParam_id = mockId.tickets.new[0] as TicketsId;
                const mockParam_dto: TicketsCreateDTO = {
                    client_id: mockValidClientId,
                    user_id: mockValidUserId,
                    option: TicketOption.SUPPORT,
                    title: 'test-title',
                    message: 'test-message'
                };
                const mockParam_files: Express.Multer.File[] | null = null;

                jest.spyOn(CommonUtils, "generateUUID").mockReturnValue(mockParam_id);
                jest.spyOn(CommonUtils, "getTimestampUTC").mockReturnValue(mockTimestamp);

                const testFn = await ticketsModel.generateTicketEntity(mockParam_dto, mockParam_files);
                const expectResult: Tickets = {
                    ticket_id: mockParam_id,
                    client_id: mockParam_dto.client_id,
                    user_id: mockParam_dto.user_id,
                    status: TicketStatus.ISSUED,
                    option: TicketOption.SUPPORT,
                    title: mockParam_dto.title,
                    message: mockParam_dto.message,
                    flag: null,
                    last_modified: mockTimestamp,
                    created_on: mockTimestamp
                };

                expect(testFn).toEqual(expectResult);
            })

            test('Generate new object, priority: single file', async () => {
                const mockParam_id = mockId.tickets.new[0] as TicketsId;
                const mockParam_dto: TicketsCreateDTO = {
                    client_id: mockValidClientId,
                    user_id: mockValidUserId,
                    option: TicketOption.SUPPORT,
                    title: 'test-title',
                    message: 'test-message'
                };
                const mockParam_files: Express.Multer.File[] | null = [mockFile_pdf];
                const mockPaths = [`tickets/${mockParam_id}/0_${mockParam_id}.pdf`];

                jest.spyOn(CommonUtils, "generateUUID").mockReturnValue(mockParam_id);
                jest.spyOn(CommonUtils, "getTimestampUTC").mockReturnValue(mockTimestamp);
                jest.spyOn(FilesService.prototype, 'transformFiles').mockImplementation();
                jest.spyOn(FilesService.prototype, 'uploadFiles').mockImplementation();
                jest.spyOn(FilesService.prototype, 'getResourcePaths').mockReturnValue(mockPaths);

                const testFn = await ticketsModel.generateTicketEntity(mockParam_dto, mockParam_files);
                const expectResult: Tickets = {
                    ticket_id: mockParam_id,
                    client_id: mockParam_dto.client_id,
                    user_id: mockParam_dto.user_id,
                    status: TicketStatus.ISSUED,
                    option: TicketOption.SUPPORT,
                    title: mockParam_dto.title,
                    message: mockParam_dto.message,
                    resource_paths: mockPaths,
                    flag: null,
                    last_modified: mockTimestamp,
                    created_on: mockTimestamp
                };

                expect(testFn).toEqual(expectResult);
            })

            test('Generate new object, priority: multiple files', async () => {
                const mockParam_id = mockId.tickets.new[0] as TicketsId;
                const mockParam_dto: TicketsCreateDTO = {
                    client_id: mockValidClientId,
                    user_id: mockValidUserId,
                    option: TicketOption.SUPPORT,
                    title: 'test-title',
                    message: 'test-message'
                };
                const mockParam_files: Express.Multer.File[] | null = [mockFile_pdf, mockFile_webp];
                const mockPaths = [
                    `tickets/${mockParam_id}/0_${mockParam_id}.pdf`,
                    `tickets/${mockParam_id}/1_${mockParam_id}.webp`
                ];

                jest.spyOn(CommonUtils, "generateUUID").mockReturnValue(mockParam_id);
                jest.spyOn(CommonUtils, "getTimestampUTC").mockReturnValue(mockTimestamp);
                jest.spyOn(FilesService.prototype, 'transformFiles').mockImplementation();
                jest.spyOn(FilesService.prototype, 'uploadFiles').mockImplementation();
                jest.spyOn(FilesService.prototype, 'getResourcePaths').mockReturnValue(mockPaths);

                const testFn = await ticketsModel.generateTicketEntity(mockParam_dto, mockParam_files);
                const expectResult: Tickets = {
                    ticket_id: mockParam_id,
                    client_id: mockParam_dto.client_id,
                    user_id: mockParam_dto.user_id,
                    status: TicketStatus.ISSUED,
                    option: TicketOption.SUPPORT,
                    title: mockParam_dto.title,
                    message: mockParam_dto.message,
                    resource_paths: mockPaths,
                    flag: null,
                    last_modified: mockTimestamp,
                    created_on: mockTimestamp
                };

                expect(testFn).toEqual(expectResult);
            })
        })
    })

    describe('Priority: fn mapTicketUpdateDto()', () => {

        describe('Testing valid fn calls', () => {

            test('Map timestamp value to DTO, result: dto TicketsUpdateDTO', () => {
                const mockTimestamp = '2025-01-01T14:00:04.000Z';
                const mockParam_dto: TicketsUpdateDTO = {
                    status: TicketStatus.PAUSED,
                    option: TicketOption.SUPPORT,
                    title: 'test-title',
                    message: 'test-message',
                    flag: null
                };

                jest.spyOn(CommonUtils, "getTimestampUTC").mockReturnValue(mockTimestamp);

                const testFn = ticketsModel.mapTicketUpdateDto(mockParam_dto);
                const expectResult: TicketsUpdateDTO = {
                    ...mockParam_dto,
                    last_modified: mockTimestamp
                };

                expect(testFn).toEqual(expectResult);
            })
        })
    })

    describe('Priority: fn handleTicketBeforeDelete()', () => {

        describe('Testing valid fn calls', () => {

            test('Check for file deletion => call FilesService.deleteFiles(), params: <dto>', async () => {
                const mockParam_dto: TicketsResponseDTO = {
                    ticket_id: mockValidTicketId,
                    client_id: mockValidClientId,
                    user_id: mockValidUserId,
                    status: TicketStatus.ISSUED,
                    option: TicketOption.SUPPORT,
                    title: 'test-title',
                    message: 'test-message',
                    resource_paths: [`tickets/${mockId.tickets.valid[0]}/0_${mockId.tickets.valid[0]}.jpg`],
                    flag: null,
                    last_modified: mockTimestamp,
                    created_on: mockTimestamp
                };
                const testSpy = jest.spyOn(FilesService.prototype, 'deleteFiles').mockImplementation();
                await ticketsModel.handleTicketBeforeDelete(mockParam_dto);

                expect(testSpy).toHaveBeenCalledWith(mockParam_dto.resource_paths);
                testSpy.mockRestore();
            })
        })

        describe('Testing invalid fn calls', () => {

            test('Check for file deletion => does NOT call FilesService.deleteFiles(), params: <dto>', async () => {
                const mockParam_dto: TicketsResponseDTO = {
                    ticket_id: mockId.tickets.valid[1] as TicketsId,
                    client_id: mockValidClientId,
                    user_id: mockValidUserId,
                    status: TicketStatus.ISSUED,
                    option: TicketOption.SUPPORT,
                    title: 'test-title-without-resource_paths',
                    message: 'test-message-without-resource_paths',
                    flag: null,
                    last_modified: mockTimestamp,
                    created_on: mockTimestamp
                };
                const testSpy = jest.spyOn(FilesService.prototype, 'deleteFiles').mockImplementation();
                await ticketsModel.handleTicketBeforeDelete(mockParam_dto);

                expect(testSpy).not.toHaveBeenCalled();
                testSpy.mockRestore();
            })
        })
    })

    describe('Priority: fn isPermittedToDelete()', () => {

        let mockParam_dto: TicketsResponseDTO;
        beforeEach(() => {
            mockParam_dto = {
                ticket_id: mockValidTicketId,
                client_id: mockValidClientId,
                user_id: mockValidUserId,
                status: TicketStatus.CLOSED,
                option: TicketOption.SUPPORT,
                title: 'test-title',
                message: 'test-message',
                flag: null,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            };
        })
        afterEach(() => {
            jest.restoreAllMocks();
        });

        describe('Testing valid fn calls', () => {

            test('Get permission to delete, params: timeRange >= 0 days, <status> = "cancel"', () => {
                jest.spyOn(CommonUtils, 'now').mockReturnValue(new Date('2025-01-03T11:07:00.000Z'));
                const testParam_dto = structuredClone(mockParam_dto);
                testParam_dto.status = TicketStatus.CANCEL;
                const testFn = ticketsModel.isPermittedToDelete(testParam_dto);
                const expectResult = true;

                expect(testFn).toBe(expectResult);
            })

            test('Get permission to delete, params: timeRange > 30 days, <status> = "closed"', () => {
                jest.spyOn(CommonUtils, 'now').mockReturnValue(new Date('2025-02-12T11:07:00.000Z'));
                const testFn = ticketsModel.isPermittedToDelete(mockParam_dto);
                const expectResult = true;

                expect(testFn).toBe(expectResult);
            })

            test('Get permission to delete, params: timeRange > 180 days, <status> = "paused"', () => {
                jest.spyOn(CommonUtils, 'now').mockReturnValue(new Date('2025-08-01T15:41:00.000Z'));
                const testParam_dto = structuredClone(mockParam_dto);
                testParam_dto.status = TicketStatus.PAUSED;
                const testFn = ticketsModel.isPermittedToDelete(testParam_dto);
                const expectResult = true;

                expect(testFn).toBe(expectResult);
            })
        })

        describe('Testing invalid fn calls', () => {

            test('Deny permission to delete, params: timeRange < 30 days, <status> = "closed"', () => {
                jest.spyOn(CommonUtils, 'now').mockReturnValue(new Date('2025-01-21T20:37:00.000Z'));
                jest.spyOn(CommonUtils, 'logError').mockImplementation();

                expect(() => ticketsModel.isPermittedToDelete(mockParam_dto))
                    .toThrow(PermissionException);
            })

            test('Deny permission to delete, params: timeRange > 30 days, <status> = "active"', () => {
                jest.spyOn(CommonUtils, 'now').mockReturnValue(new Date('2025-02-12T11:07:00.000Z'));
                const testParam_dto = structuredClone(mockParam_dto);
                testParam_dto.status = TicketStatus.ACTIVE;

                expect(() => ticketsModel.isPermittedToDelete(testParam_dto))
                    .toThrow(PermissionException);
            })

            test('Deny permission to delete, params: timeRange > 180 days, <status> = "active"', () => {
                jest.spyOn(CommonUtils, 'now').mockReturnValue(new Date('2025-08-01T15:41:00.000Z'));
                const testParam_dto = structuredClone(mockParam_dto);
                testParam_dto.status = TicketStatus.ACTIVE;

                expect(() => ticketsModel.isPermittedToDelete(testParam_dto))
                    .toThrow(PermissionException);
            })
        })
    })
})
