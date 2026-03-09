import { FeedbackRating } from "../../../src/repositories/interfaces/feedback-rating.entity.interface";
import { DBQueryErrorException } from "../../../src/utils/exceptions/db.exception";
import * as MockUtils from "../../common.test-utils";
import * as CommonUtils from "../../../src/utils/common.utils";
import { default as mockId } from "../../mock-data/id.mock-data.json";
import feedbackRatingRepository from "../../../src/repositories/feedback-rating.repository";
import { DBConnection } from "../../../src/configs/db";
import { FeedbackRatingUpdateDTO } from "../../../src/dtos/feedback-rating.dto";

jest.mock("../../../src/configs/db", () => {
    return {
        DBConnection: {
            getInstance: jest.fn()
        }
    }
});

const mockTimestamp = '2025-01-01T14:00:09.000Z';
const mockData: FeedbackRating = {
    client_id: mockId.clients.valid[0],
    count: 16,
    rating_sum: 67,
    last_modified: mockTimestamp,
    created_on: mockTimestamp
};
const expectExceptionResult = DBQueryErrorException;
const mockBoolean = false;

describe('Unit-tests (repository), priority: entity FeedbackRating', () => {

    describe('Database tests table <feedback_ratings>, priority fn findById()', () => {

        describe('Testing valid fn calls', () => {

            let sql: string;
            beforeEach(() => {
                sql = `SELECT`;
            });

            test('Return data for existing entry, params: valid <id>', async () => {
                const mockParam_id = mockId.clients.valid[0];
                const mockResult: FeedbackRating = structuredClone(mockData);
                const mockClient = MockUtils.mapMockDbClient(mockResult);
                const testFn = await feedbackRatingRepository.findById(mockParam_id);

                expect(testFn).toEqual(mockResult);
                expect(DBConnection.getInstance).toHaveBeenCalled();
                expect(mockClient.query).toHaveBeenCalledWith(
                    expect.stringContaining(sql),
                    expect.arrayContaining([mockParam_id])
                );
            })

            test('Return null for non-existing entry, params: non-existing <id>', async () => {
                const mockParam_id = mockId.clients.invalid[0];
                const mockResult = null;
                const mockClient = MockUtils.mapMockDbClient(mockResult);
                const testFn = await feedbackRatingRepository.findById(mockParam_id);

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
                const mockParam_id = mockId.clients.invalid[0];
                const mockErrorMsg = "DB ERROR ON SELECT QUERY";
                const mockResult = null;
                jest.spyOn(CommonUtils, "logError").mockReturnValue();
                const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

                await expect(() => feedbackRatingRepository.findById(mockParam_id))
                    .rejects.toThrow(expectExceptionResult);
            })
        })
    })

    describe('Database tests table <feedback_ratings>, priority fn findByClientsName()', () => {

        describe('Testing valid fn calls', () => {

            let sql: string;
            beforeEach(() => {
                sql = `SELECT`;
            });

            test('Return data for existing entry, params: valid <client_name>', async () => {
                const mockParam_client_name = 'valid_clients_test_name';
                const mockResult: FeedbackRating = structuredClone(mockData);
                const mockClient = MockUtils.mapMockDbClient(mockResult);
                const testFn = await feedbackRatingRepository.findByClientName(mockParam_client_name);

                expect(testFn).toEqual(mockResult);
                expect(DBConnection.getInstance).toHaveBeenCalled();
                expect(mockClient.query).toHaveBeenCalledWith(
                    expect.stringContaining(sql),
                    expect.arrayContaining([mockParam_client_name])
                );
            })

            test('Return null for non-existing entry, params: non-existing <client_name>', async () => {
                const mockParam_client_name = 'invalid_clients_test_name';
                const mockResult = null;
                const mockClient = MockUtils.mapMockDbClient(mockResult);
                const testFn = await feedbackRatingRepository.findByClientName(mockParam_client_name);

                expect(testFn).toEqual(mockResult);
                expect(DBConnection.getInstance).toHaveBeenCalled();
                expect(mockClient.query).toHaveBeenCalledWith(
                    expect.stringContaining(sql),
                    expect.arrayContaining([mockParam_client_name])
                );
            })
        })
        
        describe('Testing invalid fn calls', () => {

            test('Throw DBQueryErrorException by catch-block', async () => {
                const mockParam_client_name = 'invalid_clients_test_name';
                const mockErrorMsg = "DB ERROR ON SELECT QUERY";
                const mockResult = null;
                jest.spyOn(CommonUtils, "logError").mockReturnValue();
                const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

                await expect(() => feedbackRatingRepository.findByClientName(mockParam_client_name))
                    .rejects.toThrow(expectExceptionResult);
            })
        })
    })

    describe('Database tests table <feedback_ratings>, priority fn findAll()', () => {

        describe('Testing valid fn calls', () => {

            let sql: string;
            beforeEach(() => {
                sql = 'SELECT';
            });

            test('Return data for multiple existing entries', async () => {
                const mockData_entry0: FeedbackRating = structuredClone(mockData);
                const mockData_entry1: FeedbackRating = {
                    client_id: 'another_clients_test_id',
                    count: 5,
                    rating_sum: 19,
                    last_modified: mockTimestamp,
                    created_on: mockTimestamp
                };
                const mockResult: FeedbackRating[] = [mockData_entry0, mockData_entry1];

                const mockErrorMsg = undefined;
                const mockExpectArray = true;
                const mockClient = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg, mockExpectArray);
                const testFn = await feedbackRatingRepository.findAll();

                expect(testFn).toEqual(mockResult);
                expect(DBConnection.getInstance).toHaveBeenCalled();
                expect(mockClient.query).toHaveBeenCalledWith(
                    expect.stringContaining(sql)
                );
            });

            test('Return null for non-existing entry', async () => {
                const mockResult: FeedbackRating[] | null = null;

                const mockClient = MockUtils.mapMockDbClient(mockResult);
                const testFn = await feedbackRatingRepository.findAll();

                expect(testFn).toEqual(mockResult);
                expect(DBConnection.getInstance).toHaveBeenCalled();
                expect(mockClient.query).toHaveBeenCalledWith(
                    expect.stringContaining(sql)
                );
            })
        })
        
        describe('Testing invalid fn calls', () => {

            test('Throw DBQueryErrorException by catch-block', async () => {
                const mockErrorMsg = "DB ERROR ON SELECT QUERY";
                const mockResult = null;
                jest.spyOn(CommonUtils, "logError").mockReturnValue();
                const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

                await expect(() => feedbackRatingRepository.findAll())
                    .rejects.toThrow(expectExceptionResult);
            })
        })
    })

    describe('Database tests table <feedback_ratings>, priority fn createInTa()', () => {

        let sql: string;
        let mockParam_entity: FeedbackRating;
        beforeEach(() => {
            sql = `INSERT`;
            mockParam_entity = {
                client_id: mockId.clients.new[0],
                count: 0,
                rating_sum: 0,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            };
        });

        describe('Testing valid fn calls', () => {

            test('Return data for created entry, params: <client_id>', async () => {
                const mockValues: any[] = Object.values(mockParam_entity).map(value => value);
                const mockResult: FeedbackRating = structuredClone(mockParam_entity);
                const mockClient = MockUtils.mapMockDbClient(mockResult);
                const testFn = await feedbackRatingRepository.createInTa((mockClient as any), mockParam_entity);

                expect(testFn).toEqual(mockResult);
                expect(DBConnection.getInstance).toHaveBeenCalled();
                expect(mockClient.query).toHaveBeenCalledWith(
                    expect.stringContaining(sql),
                    expect.arrayContaining(mockValues)
                );
            })
        })
        
        // Testing invalid fn call is tested in feedback.integration.test.ts due to transaction structure.
    })

    describe('Database tests table <feedback_ratings>, priority fn updateInTa()', () => {

        let sql: string;
        let mockParam_dto: FeedbackRatingUpdateDTO;
        beforeEach(() => {
            sql = `UPDATE`;
            mockParam_dto = {
                rating: 5
            };
        })

        describe('Testing valid fn calls', () => {

            test('Return data of changed entry, params: valid <id, dto>', async () => {
                const mockParam_id = mockData.client_id;
                const mockValues: any[] = [mockParam_dto.rating];
                const mockResult: FeedbackRating | null = {
                    client_id: mockParam_id,
                    count: mockData.count + 1,
                    rating_sum: mockData.rating_sum + mockParam_dto.rating,
                    last_modified: mockTimestamp,
                    created_on: mockData.created_on
                };

                const mockClient = MockUtils.mapMockDbClient(mockResult);
                const testFn = await feedbackRatingRepository.updateInTa((mockClient as any), mockParam_id, mockParam_dto);

                expect(testFn).toEqual(mockResult);
                expect(DBConnection.getInstance).toHaveBeenCalled();
                expect(mockClient.query).toHaveBeenCalledWith(
                    expect.stringContaining(sql),
                    expect.arrayContaining(mockValues)
                );
            })

            test('Return null for non-existing entry, params: invalid <id, dto>', async () => {
                const mockParam_id = mockId.clients.invalid[0];
                const mockValues: any[] = [mockParam_dto.rating];
                const mockResult: FeedbackRating | null = null;

                const mockClient = MockUtils.mapMockDbClient(mockResult);
                const testFn = await feedbackRatingRepository.updateInTa((mockClient as any), mockParam_id, mockParam_dto);

                expect(testFn).toEqual(mockResult);
                expect(DBConnection.getInstance).toHaveBeenCalled();
                expect(mockClient.query).toHaveBeenCalledWith(
                    expect.stringContaining(sql),
                    expect.arrayContaining(mockValues)
                );
            })
        })
        
        // Testing invalid fn call is tested in feedback.integration.test.ts due to transaction structure.
    })
})