import { TicketsCreateDTO, TicketsUpdateDTO } from "../../../src/dtos/tickets.dto";
import * as Utils from "../../../src/utils/common.utils";
import * as mockId from "../../mock-data/id.mock-data.json";
import { TicketStatus } from "../../../src/utils/enums/ticket-status.enum";
import { Tickets } from "../../../src/repositories/interfaces/tickets.entity.interface";
import ticketsModel from "../../../src/models/tickets.model";
import { Readable } from 'stream';
import { FilesService } from "../../../src/services/files.service";

const mockTimestamp = '2025-01-01T14:00:04.000Z';

describe('Model tests, class: <tickets>, priority: generateTicket', () => {

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

        test('Generate new object, entity: <Tickets>, priority: no files', async () => {
            const mockParam_id = 'valid_tickets_test_id';
            const mockParam_dto: TicketsCreateDTO = {
                client_id: 'valid_clients_test_id',
                user_id: 'valid_users_test_id',
                message: 'test-message'
            };
            const mockParam_files: Express.Multer.File[] | null = null;

            jest.spyOn(Utils, "generateUUID").mockReturnValue(mockParam_id);
            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(mockTimestamp);

            const testFn = await ticketsModel.generateTicket(mockParam_dto, mockParam_files);
            const expectResult: Tickets = {
                ticket_id: mockParam_id,
                client_id: mockParam_dto.client_id,
                user_id: mockParam_dto.user_id,
                status: TicketStatus.ISSUED,
                message: mockParam_dto.message,
                flag: null,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            };

            expect(testFn).toEqual(expectResult);
        })

        test('Generate new object, entity: <Tickets>, priority: single file', async () => {
            const mockParam_id = mockId.tickets.new[0];
            const mockParam_dto: TicketsCreateDTO = {
                client_id: 'valid_clients_test_id',
                user_id: 'valid_users_test_id',
                message: 'test-message'
            };
            const mockParam_files: Express.Multer.File[] | null = [mockFile_pdf];
            const mockPaths = [`tickets/${mockParam_id}/0_${mockParam_id}.pdf`];

            jest.spyOn(Utils, "generateUUID").mockReturnValue(mockParam_id);
            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(mockTimestamp);
            jest.spyOn(FilesService.prototype, 'transformFiles').mockImplementation();
            jest.spyOn(FilesService.prototype, 'uploadFiles').mockImplementation();
            jest.spyOn(FilesService.prototype, 'getResourcePaths').mockReturnValue(mockPaths);

            const testFn = await ticketsModel.generateTicket(mockParam_dto, mockParam_files);
            const expectResult: Tickets = {
                ticket_id: mockParam_id,
                client_id: mockParam_dto.client_id,
                user_id: mockParam_dto.user_id,
                status: TicketStatus.ISSUED,
                message: mockParam_dto.message,
                resource_paths: mockPaths,
                flag: null,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            };

            expect(testFn).toEqual(expectResult);
        })

        test('Generate new object, entity: <Tickets>, priority: multiple files', async () => {
            const mockParam_id = mockId.tickets.new[0];
            const mockParam_dto: TicketsCreateDTO = {
                client_id: 'valid_clients_test_id',
                user_id: 'valid_users_test_id',
                message: 'test-message'
            };
            const mockParam_files: Express.Multer.File[] | null = [mockFile_pdf, mockFile_webp];
            const mockPaths = [
                `tickets/${mockParam_id}/0_${mockParam_id}.pdf`,
                `tickets/${mockParam_id}/1_${mockParam_id}.webp`
            ];

            jest.spyOn(Utils, "generateUUID").mockReturnValue(mockParam_id);
            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(mockTimestamp);
            jest.spyOn(FilesService.prototype, 'transformFiles').mockImplementation();
            jest.spyOn(FilesService.prototype, 'uploadFiles').mockImplementation();
            jest.spyOn(FilesService.prototype, 'getResourcePaths').mockReturnValue(mockPaths);

            const testFn = await ticketsModel.generateTicket(mockParam_dto, mockParam_files);
            const expectResult: Tickets = {
                ticket_id: mockParam_id,
                client_id: mockParam_dto.client_id,
                user_id: mockParam_dto.user_id,
                status: TicketStatus.ISSUED,
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

describe('Model tests, class: <tickets>, priority: <mapTicketUpdateDto>', () => {

    describe('Testing valid fn calls', () => {

        test('Map timestamp value to DTO, entity: <TicketsUpdateDTO>', () => {
            const mockTimestamp = '2025-01-01T14:00:04.000Z';
            const mockParam_dto: TicketsUpdateDTO = {
                status: TicketStatus.PAUSED,
                message: 'test-message',
                flag: null
            };

            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(mockTimestamp);

            const testFn = ticketsModel.mapTicketUpdateDto(mockParam_dto);
            const expectResult: TicketsUpdateDTO = {
                ...mockParam_dto,
                last_modified: mockTimestamp
            };

            expect(testFn).toEqual(expectResult);
        })
    })
})