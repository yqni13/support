import axios from "axios";
import { TicketsId } from "../../../src/repositories/interfaces/tickets.entity.interface";
import { NotificationFeedbackParams, NotificationPenaltyParams, NotificationPostParams, NotificationTicketsParams } from "../../../src/services/interfaces/notification.interface.service";
import { NotificationService } from "../../../src/services/notificiation.service";
import * as CommonUtils from "../../../src/utils/common.utils";
import { TicketOption } from "../../../src/utils/enums/ticket-option.enum";
import { secrets } from "../../../src/utils/secrets.utils";
import { default as mockId } from "../../mock-data/id.mock-data.json";
import { FeedbackId } from "../../../src/repositories/interfaces/feedback.entity.interface";
import { UsersId } from "../../../src/repositories/interfaces/users.entity.interface";
import { Violation } from "../../../src/utils/enums/violations.enum";
import { Flag } from "../../../src/utils/enums/flag.enum";

describe('Unit-tests (service), priority: class CloudService', () => {

    let notification: NotificationService;
    let mockTimestamp: string;
    beforeEach(() => {
        notification = NotificationService.getInstance();
        mockTimestamp = '2025-01-01T14:01:00.000Z';
        jest.clearAllMocks();
    })

    describe('Service tests, priority: fn sendTicketInfo()', () => {

        describe('Testing valid fn calls', () => {

            test('Call axios fn post(), params: valid <NotificationTicketParams>', async () => {
                const mockParam_data: NotificationTicketsParams = {
                    ticket_id: mockId.tickets.valid[0] as TicketsId,
                    option: TicketOption.SUPPORT,
                    title: 'new-test-title',
                    client_name: 'TESTCLIENT',
                    user_email: 'max.mustermann@yqni13.com',
                    created_on: mockTimestamp
                };
                jest.spyOn(CommonUtils, 'getTimestampUTC').mockReturnValue(mockTimestamp);
                const mockAxios = jest.spyOn(axios, 'post').mockResolvedValue({ status: 200 });

                await notification.sendTicketInfo(mockParam_data);
                const mockResult_text = (mockAxios.mock.calls[0][1] as any).text;

                Object.values(mockParam_data).forEach((val: any) => {
                    expect(mockResult_text).toContain(val.toString());
                });
            })
        })
    })

    describe('Service tests, priority: fn sendFeedbackInfo()', () => {

        describe('Testing valid fn calls', () => {

            test('Call axios fn post(), params: valid <NotificationFeedbackParams>', async () => {
                const mockParam_data: NotificationFeedbackParams = {
                    feedback_id: mockId.feedback.valid[0] as FeedbackId,
                    rating: 5,
                    rating_average: 4.9,
                    term_accepted: true,
                    client_name: 'TESTCLIENT',
                    user_email: 'max.mustermann@yqni13.com',
                    created_on: mockTimestamp
                };
                jest.spyOn(CommonUtils, 'getTimestampUTC').mockReturnValue(mockTimestamp);
                const mockAxios = jest.spyOn(axios, 'post').mockResolvedValue({ status: 200 });

                await notification.sendFeedbackInfo(mockParam_data);
                const mockResult_text = (mockAxios.mock.calls[0][1] as any).text;

                Object.values(mockParam_data).forEach((val: any) => {
                    expect(mockResult_text).toContain(val.toString());
                });
            })
        })
    })

    describe('Service tests, priority: fn sendPenaltyInfo()', () => {

        describe('Testing valid fn calls', () => {

            test('Call axios fn post(), params: valid <NotificationPenaltyParams>', async () => {
                const mockParam_data: NotificationPenaltyParams = {
                    id: mockId.users.valid[0] as UsersId,
                    entity: 'Users',
                    user_email: 'max.mustermann@yqni13.com',
                    violation: Violation.USERSFLAG,
                    penalty: Flag.WARNING
                };
                const mockAxios = jest.spyOn(axios, 'post').mockResolvedValue({ status: 200 });

                await notification.sendPenaltyInfo(mockParam_data);
                const mockResult_text = (mockAxios.mock.calls[0][1] as any).text;

                Object.values(mockParam_data).forEach((val: any) => {
                    expect(mockResult_text).toContain(val.toString());
                });
            })
        })
    })

    describe('Service tests, priority: fn notify()', () => {

        let mockParam_params: NotificationPostParams;
        beforeEach(() => {
            mockParam_params = {
                text: 'test-text',
                logMsg: 'TEST ERROR ON NOTIFY',
                logMethod: 'Support_NotificationService_notify'
            }
            jest.clearAllMocks();
        })

        describe('Testing valid fn calls', () => {

            test('Call axios fn post(), params: <NotificationPostParams>', async () => {
                const mockAdminId = 'valid-test-admin-id';
                const mockBotKey = 'valid-test-bot-key';
                jest.replaceProperty(secrets, 'NOTIFY_ADMIN_ID', mockAdminId);
                jest.replaceProperty(secrets, 'NOTIFY_BOT_KEY', mockBotKey);
                const mockAxios = jest.spyOn(axios, 'post').mockResolvedValue({ status: 200 });

                await (notification as any).notify(mockParam_params); // private fn

                expect(mockAxios).toHaveBeenCalledTimes(1);
                expect(mockAxios).toHaveBeenCalledWith(
                    `https://api.telegram.org/bot${mockBotKey}/sendMessage`,
                    expect.objectContaining({ chat_id: mockAdminId })
                );
            })
        })

        describe('Testing invalid fn calls()', () => {

            test('Call axios fn post(), throw exception on mocked api call', async () => {
                const mockError = jest.spyOn(CommonUtils, 'logError').mockImplementation(() => {});
                const mockAxiosError = new Error('test-error');
                const mockAxios = jest.spyOn(axios, 'post').mockResolvedValue({ status: 200 });

                mockAxios.mockRejectedValue(mockAxiosError);
                // Notification runs without throwing Error.
                await expect((notification as any).notify(mockParam_params)).resolves.not.toThrow();

                expect(mockError).toHaveBeenCalledTimes(1);
                expect(mockError).toHaveBeenCalledWith(
                    mockParam_params.logMsg,
                    mockParam_params.logMethod,
                    mockAxiosError
                );
            })
        })
    })
})