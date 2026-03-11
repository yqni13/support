import {
    FeedbackCreateDTO,
    FeedbackFilterDTO,
    FeedbackResponseDTO,
    FeedbackUpdateReviewDTO
} from "../dtos/feedback.dto";
import { FeedbackRatingCreateDTO, FeedbackRatingResponseDTO, FeedbackRatingUpdateDTO } from "../dtos/feedback-rating.dto";
import * as RepoUtils from "../utils/repository.utils";
import feedbackRatingModel from "../models/feedback-rating.model";
import feedbackModel from "../models/feedback.model";
import feedbackRepository from "../repositories/feedback.repository";
import { Feedback, FeedbackId } from "../repositories/interfaces/feedback.entity.interface";
import feedbackRatingService from "./feedback-rating.service";
import { DBConstraintErrorException } from "../utils/exceptions/db.exception";

class FeedbackService {
    async getFeedbackById(id: FeedbackId): Promise<FeedbackResponseDTO | null> {
        const result = await feedbackRepository.findById(id);
        return !result ? null : feedbackModel.toFeedbackResponseDTO(result);
    }

    async searchFeedbackEntriesByFilter(dto: FeedbackFilterDTO): Promise<FeedbackResponseDTO[] | null> {
        const result: Feedback[] | null = await feedbackRepository.findByFilter(dto);
        return !result ? null : feedbackModel.toFeedbackResponseDTOArray(result);
    }

    /**
     * @description Create is used to create new or overwrite existing Feedback with new data inside database transaction => FeedbackRating created/updated in same process.
     */
    async createFeedback(dto: FeedbackCreateDTO): Promise<FeedbackResponseDTO | null> {
        const message = "DB ERROR ON FEEDBACK/FEEDBACK-RATING TRANSACTION";
        const method = "SUPPORT_FeedbackService_createFeedback";

        return RepoUtils.asTransaction(message, method, async(client) => {
            const entity: Partial<Feedback> = feedbackModel.generateFeedbackEntity(dto);
            const result: FeedbackResponseDTO | null = await feedbackRepository.upsertInTa(client, entity);
            let dtoUpdateFR: FeedbackRatingUpdateDTO;
            if(!result) {
                return null;
            } else if(result.blocked) {
                // Update on feedback is not allowed if message exists for entry without being reviewed yet.
                throw new DBConstraintErrorException('support-constraint-feedback');
            } else if(new Date(result.created_on).getTime() === new Date(entity.created_on!).getTime()) {
                // New Feedback was created => increase rating_sum.
                dtoUpdateFR = { count: 1, rating: dto.rating };
            } else {
                // Existing Feedback was updated => update existing rating_sum (delta).
                const rating_delta = result.rating_old ? (dto.rating - result.rating_old) : dto.rating;
                dtoUpdateFR = { rating: rating_delta };
            }
            dtoUpdateFR = feedbackRatingModel.mapFeedbackRatingUpdateDTO(dtoUpdateFR);
            const update: FeedbackRatingResponseDTO | null = 
                await feedbackRatingService.updateFeedbackRatingInTa(client, result.client_id, dtoUpdateFR);
            if(!update) {
                const dtoCreateFR: FeedbackRatingCreateDTO = {
                    client_id: dto.client_id,
                    count: 1,
                    rating_sum: dto.rating
                };
                await feedbackRatingService.createFeedbackRatingInTa(client, dtoCreateFR);
            }
            // Delete blocked info and use rating from dto if no other ratings for this client exist.
            delete result['blocked'];
            return {
                ...result,
                rating_average_new: update?.rating_average ?? dto.rating
            }
        })
    }

    async updateFeedbackReview(id: FeedbackId): Promise<FeedbackResponseDTO | null> {
        const dto: FeedbackUpdateReviewDTO = feedbackModel.generateFeedbackUpdateReviewDTO();
        const result: Feedback | null = await feedbackRepository.updateReview(id, dto);
        return !result ? null : feedbackModel.toFeedbackResponseDTO(result);
    }
}

export default new FeedbackService();