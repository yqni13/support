import {
    FeedbackCreateDTO,
    FeedbackCreateResponseDTO,
    FeedbackExtendedResponseDTO,
    FeedbackFilterDTO,
    FeedbackResponseDTO,
    FeedbackUpdateReviewDTO
} from "../dtos/feedback.dto";
import { FeedbackRatingCreateDTO, FeedbackRatingResponseDTO, FeedbackRatingUpdateDTO } from "../dtos/feedback-rating.dto";
import * as RepoUtils from "../utils/repository.utils";
import * as CommonUtils from "../utils/common.utils";
import feedbackRatingModel from "../models/feedback-rating.model";
import feedbackModel from "../models/feedback.model";
import feedbackRepository from "../repositories/feedback.repository";
import { Feedback, FeedbackId } from "../repositories/interfaces/feedback.entity.interface";
import feedbackRatingService from "./feedback-rating.service";
import { DBConstraintErrorException } from "../utils/exceptions/db.exception";
import { NotificationService } from "./notificiation.service";

class FeedbackService {
    async getFeedbackById(id: FeedbackId): Promise<FeedbackResponseDTO | null> {
        const result: Feedback | null = await feedbackRepository.findById(id);
        return !result ? null : feedbackModel.toFeedbackResponseDTO(result);
    }

    async searchFeedbackEntriesByFilter(dto: FeedbackFilterDTO): Promise<FeedbackResponseDTO[] | null> {
        const result: Feedback[] | null = await feedbackRepository.findByFilter(dto);
        return !result ? null : feedbackModel.toFeedbackResponseDTOArray(result);
    }

    /**
     * @description Create is used to create new or overwrite existing Feedback with new data inside 
     * database transaction => FeedbackRating created/updated in same process.
     */
    async createFeedback(dto: FeedbackCreateDTO): Promise<FeedbackCreateResponseDTO | null> {
        const message = "DB ERROR ON FEEDBACK/FEEDBACK-RATING TRANSACTION";
        const method = "SUPPORT_FeedbackService_createFeedback";

        return RepoUtils.asTransaction(message, method, async(client) => {
            const entity: Partial<Feedback> = feedbackModel.generateFeedbackEntity(dto);
            const result: FeedbackExtendedResponseDTO | null = await feedbackRepository.upsertInTa(client, entity);

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
                await feedbackRatingService.updateFeedbackRatingInTa(client, dto.client_id, dtoUpdateFR);

            if(!update) {
                const dtoCreateFR: FeedbackRatingCreateDTO = {
                    client_id: dto.client_id,
                    count: 1,
                    rating_sum: dto.rating
                };
                await feedbackRatingService.createFeedbackRatingInTa(client, dtoCreateFR);
            }
            const rating_average = update?.rating_average ?? dto.rating;
            const convertedCreatedOn = CommonUtils.getTimestampUTC(new Date(result.created_on));

            if(dto.message) {
                // Notify on new rating including criticism or praise.
                const notification = NotificationService.getInstance();
                await notification.sendFeedbackInfo({
                    feedback_id: result.feedback_id,
                    client_name: result.client_name,
                    user_email: result.user_email,
                    rating: result.rating,
                    rating_average: rating_average,
                    term_accepted: result.term_accepted,
                    created_on: convertedCreatedOn
                });
            }

            return {
                rating: result.rating,
                rating_old: result.rating_old,
                rating_average_new: rating_average,
                created_on: convertedCreatedOn
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