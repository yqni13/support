import * as MockUtils from "../../common.test-utils";
import * as CommonUtils from "../../../src/utils/common.utils";
import { default as mockId } from "../../mock-data/id.mock-data.json";
import { DBQueryErrorException } from "../../../src/utils/exceptions/db.exception";
import { Feedback } from "../../../src/repositories/interfaces/feedback.entity.interface";
import { DBConnection } from "../../../src/configs/db";
import feedbackRepository from "../../../src/repositories/feedback.repository";
import { FeedbackFilterDTO, FeedbackUpdateReviewDTO } from "../../../src/dtos/feedback.dto";

jest.mock("../../../src/configs/db", () => {
    return {
        DBConnection: {
            getInstance: jest.fn()
        }
    }
});

const mockTimestamp = '2025-01-01T14:00:08.000Z';
const mockData: Feedback = {
    feedback_id: mockId.feedback.valid[0],
    client_id: mockId.clients.valid[0],
    user_id: mockId.users.valid[0],
    rating: 5,
    term_accepted: true,
    message: 'valid_feedback_test_message',
    last_modified: mockTimestamp,
    created_on: mockTimestamp
};
const expectExceptionResult = DBQueryErrorException;
const mockBoolean = false;

describe('Unit-tests (repository), priority: entity Feedback', () => {

    describe('Database tests table <feedback_entries>, priority fn findById()', () => {

        describe('Testing valid fn calls', () => {

            let sql: string;
            beforeEach(() => {
                sql = `SELECT`;
            });

            test('Return data for existing entry, params: valid <id>', async () => {
                const mockParam_id = mockId.feedback.valid[0];
                const mockResult: Feedback = structuredClone(mockData);
                const mockClient = MockUtils.mapMockDbClient(mockResult);
                const testFn = await feedbackRepository.findById(mockParam_id);

                expect(testFn).toEqual(mockResult);
                expect(DBConnection.getInstance).toHaveBeenCalled();
                expect(mockClient.query).toHaveBeenCalledWith(
                    expect.stringContaining(sql),
                    expect.arrayContaining([mockParam_id])
                );
            })

            test('Return null for non-existing entry, params: non-existing <id>', async () => {
                const mockParam_id = mockId.feedback.invalid[0];
                const mockResult = null;
                const mockClient = MockUtils.mapMockDbClient(mockResult);
                const testFn = await feedbackRepository.findById(mockParam_id);

                expect(testFn).toEqual(mockResult);
                expect(DBConnection.getInstance).toHaveBeenCalled();
                expect(mockClient.query).toHaveBeenCalledWith(
                    expect.stringContaining(sql),
                    expect.arrayContaining([mockParam_id])
                );
            })
        })

        describe('Testing invalid fn calls', () => {

            test('Throw DBQueryErrorException by catch-block', async () => {
                const mockParam_id = mockId.feedback.invalid[0];
                const mockErrorMsg = "DB ERROR ON SELECT QUERY";
                const mockResult = null;
                jest.spyOn(CommonUtils, "logError").mockReturnValue();
                const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

                await expect(() => feedbackRepository.findById(mockParam_id))
                    .rejects.toThrow(expectExceptionResult);
            })
        })
    })

    describe('Database tests table <feedback_entries>, priority fn findByFilter()', () => {

        describe('Testing valid fn calls', () => {

            let sql: string;
            beforeEach(() => {
                sql = `SELECT`;
            });

            test('Return data for existing entry, params: valid <user_id>', async () => {
                const mockParam_dto: FeedbackFilterDTO = { user_id: mockData.user_id };
                const mockValues = [mockParam_dto.user_id];
                const mockResult: Feedback[] = [structuredClone(mockData)];

                const mockErrorMsg = undefined;
                const mockExpectArray = true;
                const mockClient = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg, mockExpectArray);
                const testFn = await feedbackRepository.findByFilter(mockParam_dto);

                expect(testFn).toEqual(mockResult);
                expect(DBConnection.getInstance).toHaveBeenCalled();
                expect(mockClient.query).toHaveBeenCalledWith(
                    expect.stringContaining(sql),
                    expect.arrayContaining(mockValues)
                );
            })

            test('Return null for non-existing entry, params: non-existing <user_id>', async () => {
                const mockParam_dto = { user_id: [mockId.users.invalid[0], 'another_invalid_users_test_id'] };
                const mockValues = mockParam_dto.user_id;
                const mockResult: Feedback[] | null = null;

                const mockClient = MockUtils.mapMockDbClient(mockResult);
                const testFn = await feedbackRepository.findByFilter(mockParam_dto);

                expect(testFn).toEqual(mockResult);
                expect(DBConnection.getInstance).toHaveBeenCalled();
                expect(mockClient.query).toHaveBeenCalledWith(
                    expect.stringContaining(sql),
                    expect.arrayContaining(mockValues)
                );
            })
        })

        describe('Testing invalid fn calls', () => {

            test('Throw DBQueryErrorException by catch-block', async () => {
                const mockErrorMsg = "DB ERROR ON SELECT QUERY";
                const mockResult = null;
                const mockParam_dto = {};
                jest.spyOn(CommonUtils, "logError").mockReturnValue();
                const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

                await expect(() => feedbackRepository.findByFilter(mockParam_dto))
                    .rejects.toThrow(expectExceptionResult);
            })
        })
    })

    describe('Database tests table <feedback_entries>, priority fn upsert()', () => {

        describe('Testing valid fn calls', () => {

            test('Return data for created entry, params: <entity> Partial<Feedback>', async () => {
                const mockParam_entity: Partial<Feedback> = structuredClone(mockData);
                delete mockParam_entity.feedback_id;
                const mockValues: any[] = Object.values(mockParam_entity).map(value => value);
                const sql = `INSERT`;

                const mockResult: Feedback = structuredClone(mockData);
                const mockClient = MockUtils.mapMockDbClient(mockResult);
                const testFn = await feedbackRepository.upsert((mockClient as any), mockParam_entity);

                expect(testFn).toEqual(mockResult);
                expect(DBConnection.getInstance).toHaveBeenCalled();
                expect(mockClient.query).toHaveBeenCalledWith(
                    expect.stringContaining(sql),
                    expect.arrayContaining(mockValues)
                );
            })
        })

        // Testing invalid fn call is tested in feedback.integration.test.ts file.
    })

    describe('Database tests table <feedback_entries>, priority fn updateReview()', () => {

        let sql: string;
        let mockParam_dto: FeedbackUpdateReviewDTO;
        beforeEach(() => {
            sql = `UPDATE`;
            mockParam_dto = {
                reviewed_on: mockTimestamp,
                last_modified: mockTimestamp
            };
        })

        describe('Testing valid fn calls', () => {

            test('Return data of changed entry, params: valid <id>', async () => {
                const mockParam_id = mockId.feedback.valid[0];
                const mockValues: any[] = [mockParam_dto.reviewed_on, mockParam_dto.last_modified];
                const mockResult: Feedback | null = structuredClone(mockData);

                const mockClient = MockUtils.mapMockDbClient(mockResult);
                const testFn = await feedbackRepository.updateReview(mockParam_id, mockParam_dto);

                expect(testFn).toEqual(mockResult);
                expect(DBConnection.getInstance).toHaveBeenCalled();
                expect(mockClient.query).toHaveBeenCalledWith(
                    expect.stringContaining(sql),
                    expect.arrayContaining(mockValues)
                );
            })

            test('Return data of changed entry, params: invalid <id>', async () => {
                const mockParam_id = mockId.feedback.invalid[0];
                const mockValues: any[] = [mockParam_dto.reviewed_on, mockParam_dto.last_modified];
                const mockResult: Feedback | null = null;

                const mockClient = MockUtils.mapMockDbClient(mockResult);
                const testFn = await feedbackRepository.updateReview(mockParam_id, mockParam_dto);

                expect(testFn).toEqual(mockResult);
                expect(DBConnection.getInstance).toHaveBeenCalled();
                expect(mockClient.query).toHaveBeenCalledWith(
                    expect.stringContaining(sql),
                    expect.arrayContaining(mockValues)
                );
            })
        })

        describe('Testing invalid fn calls', () => {

            test('', async () => {
                const mockParam_id = mockId.feedback.invalid[0];
                const mockErrorMsg = "DB ERROR ON UPDATE QUERY";
                const mockResult = null;
                jest.spyOn(CommonUtils, "logError").mockReturnValue();
                const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

                await expect(() => feedbackRepository.updateReview(mockParam_id, mockParam_dto))
                    .rejects.toThrow(expectExceptionResult);
            })
        })
    })
})