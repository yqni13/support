import { FeedbackRatingCreateDTO, FeedbackRatingExtendedResponseDTO, FeedbackRatingResponseDTO, FeedbackRatingUpdateDTO } from "../../../src/dtos/feedback-rating.dto";
import feedbackRatingModel from "../../../src/models/feedback-rating.model";
import { FeedbackRating } from "../../../src/repositories/interfaces/feedback-rating.entity.interface";
import * as CommonUtils from "../../../src/utils/common.utils";
import * as mockId from "../../mock-data/id.mock-data.json";

const mockTimestamp = '2025-01-01T14:00:09.000Z';

describe('Unit-tests (model), priority: entity FeedbackRating', () => {

    describe('Priority: fn generateFeedbackRating()', () =>{

        describe('Testing valid fn calls', () => {

            test('Generate new object', () => {
                const mockParam_dto: FeedbackRatingCreateDTO = {
                    client_id: mockId.clients.valid[0]
                };
                jest.spyOn(CommonUtils, "getTimestampUTC").mockReturnValue(mockTimestamp);

                const testFn = feedbackRatingModel.generateFeedbackRating(mockParam_dto);
                const expectResult: FeedbackRating = {
                    client_id: mockParam_dto.client_id,
                    count: 0,
                    rating_sum: 0,
                    last_modified: mockTimestamp,
                    created_on: mockTimestamp
                };

                expect(testFn).toEqual(expectResult);
            })
        })
    })

    describe('Priority: fn mapFeedbackRatingUpdateDTO()', () =>{

        describe('Testing valid fn calls', () => {

            test('Map timestamp value to DTO, result: dto FeedbackRatingUpdateDTO', () => {
                const mockParam_dto: FeedbackRatingUpdateDTO = { rating: 3 };
                const mockNewTimestamp = '2026-01-01T14:00:09.000Z';
                jest.spyOn(CommonUtils, "getTimestampUTC").mockReturnValue(mockNewTimestamp);

                const testFn = feedbackRatingModel.mapFeedbackRatingUpdateDTO(mockParam_dto);
                const expectResult: FeedbackRatingUpdateDTO = {
                    ...mockParam_dto,
                    last_modified: mockNewTimestamp
                };

                expect(testFn).toEqual(expectResult);
            })
        })
    })

    describe('Priority: fn mapAverageRating()', () =>{

        describe('Testing valid fn calls', () => {

            test('Map average rating to response, result: dto FeedbackRatingExtendedResponseDTO', () => {
                const mockParam_entity: FeedbackRating = {
                    client_id: mockId.clients.valid[0],
                    count: 16,
                    rating_sum: 67,
                    last_modified: mockTimestamp,
                    created_on: mockTimestamp
                };
                const mockParam_extended: boolean = true;
                
                const testFn = feedbackRatingModel.mapAverageRating(mockParam_entity, mockParam_extended);
                const expectResult: FeedbackRatingExtendedResponseDTO = {
                    ...mockParam_entity,
                    rating_average: 4.2
                };

                expect(testFn).toEqual(expectResult);
            })

            test('Map average rating to response, result: dto FeedbackRatingResponseDTO', () => {
                const mockParam_entity: FeedbackRating = {
                    client_id: mockId.clients.valid[0],
                    count: 16,
                    rating_sum: 67,
                    last_modified: mockTimestamp,
                    created_on: mockTimestamp
                };
                const mockParam_extended: boolean = false;
                
                const testFn = feedbackRatingModel.mapAverageRating(mockParam_entity, mockParam_extended);
                const expectResult: FeedbackRatingResponseDTO = {
                    rating_average: 4.2
                };

                expect(testFn).toEqual(expectResult);
            })
        })
    })
})