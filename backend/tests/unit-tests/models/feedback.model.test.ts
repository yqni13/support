import { FeedbackRatingResponseDTO } from "../../../src/dtos/feedback-rating.dto";
import { FeedbackCreateDTO, FeedbackResponseDTO, FeedbackUpdateReviewDTO } from "../../../src/dtos/feedback.dto";
import feedbackModel from "../../../src/models/feedback.model";
import { ClientsId } from "../../../src/repositories/interfaces/clients.entity.interface";
import { Feedback } from "../../../src/repositories/interfaces/feedback.entity.interface";
import { UsersId } from "../../../src/repositories/interfaces/users.entity.interface";
import * as CommonUtils from "../../../src/utils/common.utils";
import * as mockId from "../../mock-data/id.mock-data.json";

const mockValidClientId = mockId.clients.valid[0] as ClientsId;
const mockValidUserId = mockId.users.valid[0] as UsersId;
const mockTimestamp = '2025-01-01T14:00:08.000Z';

describe('Unit-tests (model), priority: entity Feedback', () => {

    let mockEntity: Feedback;
    beforeEach(() => {
        mockEntity = {
            feedback_id: mockId.feedback.valid[0],
            client_id: mockValidClientId,
            user_id: mockValidUserId,
            rating: 5,
            term_accepted: true,
            message: 'valid_feedback_test_message',
            last_modified: mockTimestamp,
            created_on: mockTimestamp
        };
    })

    describe('Priority: fn generateFeedbackEntity()', () => {

        describe('Testing valid fn calls', () => {

            test('Generate new object, params: <dto> FeedbackCreateDTO', () => {
                const mockParam_dto: FeedbackCreateDTO = {
                    client_id: mockEntity.client_id,
                    user_id: mockEntity.user_id,
                    rating: mockEntity.rating,
                    term_accepted: mockEntity.term_accepted,
                    message: mockEntity.message,
                };
                jest.spyOn(CommonUtils, 'getTimestampUTC').mockReturnValue(mockTimestamp);

                const expectResult: Partial<Feedback> = structuredClone(mockEntity);
                delete expectResult.feedback_id;
                const testFn = feedbackModel.generateFeedbackEntity(mockParam_dto);

                expect(testFn).toMatchObject(expectResult);
            })
        })
    })

    describe('Priority: fn generateFeedbackUpdateReviewDTO()', () => {

        describe('Testing valid fn calls', () => {

            test('Generate new object, params: <dto> FeedbackUpdateReviewDTO', () => {
                jest.spyOn(CommonUtils, 'getTimestampUTC').mockReturnValue(mockTimestamp);
                const expectResult: FeedbackUpdateReviewDTO = {
                    reviewed_on: mockTimestamp,
                    last_modified: mockTimestamp
                };
                const testFn = feedbackModel.generateFeedbackUpdateReviewDTO();

                expect(testFn).toMatchObject(expectResult);
            })
        })
    })

    describe('Priority: fn toFeedbackResponseDTO()', () => {

        describe('Testing valid fn calls', () => {

            test('Convert entity to dto, params: <entity> Feedback', () => {
                const mockParam_entity: Feedback = structuredClone(mockEntity);
                mockParam_entity.reviewed_on = mockTimestamp;

                jest.spyOn(CommonUtils, 'getTimestampUTC').mockReturnValue(mockTimestamp);
                const expectResult: FeedbackResponseDTO = {
                    feedback_id: mockEntity.feedback_id,
                    client_id: mockEntity.client_id,
                    user_id: mockEntity.user_id,
                    rating: mockEntity.rating,
                    term_accepted: mockEntity.term_accepted,
                    message: mockEntity.message,
                    reviewed_on: mockTimestamp,
                    last_modified: mockTimestamp,
                    created_on: mockTimestamp
                };
                const testFn = feedbackModel.toFeedbackResponseDTO(mockParam_entity);

                expect(testFn).toMatchObject(expectResult);
            })

            test('Convert entity to dto, params: <entity, newRating> Feedback/FeedbackRatingResponseDTO', () => {
                const mockParam_entity: Feedback = structuredClone(mockEntity);
                mockParam_entity.reviewed_on = mockTimestamp;
                const mockParam_newRating: FeedbackRatingResponseDTO = { rating_average: 4.2 };

                jest.spyOn(CommonUtils, 'getTimestampUTC').mockReturnValue(mockTimestamp);
                const expectResult: FeedbackResponseDTO = {
                    feedback_id: mockEntity.feedback_id,
                    client_id: mockEntity.client_id,
                    user_id: mockEntity.user_id,
                    rating: mockEntity.rating,
                    rating_average_new: mockParam_newRating.rating_average,
                    term_accepted: mockEntity.term_accepted,
                    message: mockEntity.message,
                    reviewed_on: mockTimestamp,
                    last_modified: mockTimestamp,
                    created_on: mockTimestamp
                };
                const testFn = feedbackModel.toFeedbackResponseDTO(mockParam_entity, mockParam_newRating);

                expect(testFn).toMatchObject(expectResult);
            })
        })
    })

    describe('Priority: fn toFeedbackResponseDTOArray()', () => {

        describe('Testing valid fn calls', () => {

            test('Convert entities to array of dto`s, params: <entities> Feedback[]', () => {
                const originalEntity: Feedback = structuredClone(mockEntity);
                originalEntity.reviewed_on = mockTimestamp;
                const newEntity: Feedback = {
                    feedback_id: mockId.feedback.valid[1],
                    client_id: mockValidClientId,
                    user_id: mockId.users.valid[1] as UsersId,
                    rating: 4,
                    term_accepted: false,
                    message: 'another_valid_feedback_test_message',
                    reviewed_on: mockTimestamp,
                    last_modified: mockTimestamp,
                    created_on: mockTimestamp
                };
                const mockParam_entities: Feedback[] = [originalEntity, newEntity];

                jest.spyOn(CommonUtils, 'getTimestampUTC').mockReturnValue(mockTimestamp);
                const expectResult: FeedbackResponseDTO[] = [
                    {
                        feedback_id: originalEntity.feedback_id,
                        client_id: originalEntity.client_id,
                        user_id: originalEntity.user_id,
                        rating: originalEntity.rating,
                        term_accepted: originalEntity.term_accepted,
                        message: originalEntity.message,
                        reviewed_on: originalEntity.reviewed_on,
                        last_modified: originalEntity.last_modified,
                        created_on: originalEntity.created_on
                    },
                    {
                        feedback_id: newEntity.feedback_id,
                        client_id: newEntity.client_id,
                        user_id: newEntity.user_id,
                        rating: newEntity.rating,
                        term_accepted: newEntity.term_accepted,
                        message: newEntity.message,
                        reviewed_on: newEntity.reviewed_on,
                        last_modified: newEntity.last_modified,
                        created_on: newEntity.created_on
                    }
                ];
                const testFn = feedbackModel.toFeedbackResponseDTOArray(mockParam_entities);

                expect(testFn).toMatchObject(expectResult);
            })
        })
    })
})