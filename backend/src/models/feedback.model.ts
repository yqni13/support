import * as CommonUtils from "../utils/common.utils";
import { FeedbackCreateDTO, FeedbackResponseDTO, FeedbackUpdateReviewDTO } from "../dtos/feedback.dto";
import { Feedback } from "../repositories/interfaces/feedback.entity.interface";
import { FeedbackRatingResponseDTO } from "../dtos/feedback-rating.dto";

class FeedbackModel {
    generateFeedbackEntity(dto: FeedbackCreateDTO): Partial<Feedback> {
        const timestamp = CommonUtils.getTimestampUTC()
        return {
            ...dto,
            last_modified: timestamp,
            created_on: timestamp
        }
    }

    generateFeedbackUpdateReviewDTO(): FeedbackUpdateReviewDTO {
        const timestamp = CommonUtils.getTimestampUTC();
        return {
            reviewed_on: timestamp,
            last_modified: timestamp
        };
    }

    toFeedbackResponseDTO(entity: Feedback, newRating?: FeedbackRatingResponseDTO): FeedbackResponseDTO {
        return {
            ...entity,
            rating_average_new: newRating?.rating_average,
            reviewed_on: entity.reviewed_on ? CommonUtils.getTimestampUTC(new Date(entity.reviewed_on)) : undefined,
            last_modified: CommonUtils.getTimestampUTC(new Date(entity.last_modified)),
            created_on: CommonUtils.getTimestampUTC(new Date(entity.created_on))
        }
    }

    toFeedbackResponseDTOArray(entities: Feedback[]): FeedbackResponseDTO[] {
        return entities.map(entity => this.toFeedbackResponseDTO(entity));
    }
}

export default new FeedbackModel();