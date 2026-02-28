import * as CommonUtils from "../utils/common.utils";
import { FeedbackRatingCreateDTO, FeedbackRatingExtendedResponseDTO, FeedbackRatingResponseDTO, FeedbackRatingUpdateDTO } from "../dtos/feedback-rating.dto";
import { FeedbackRating } from "../repositories/interfaces/feedback-rating.entity.interface";

class FeedbackRatingModel {
    generateFeedbackRating(dto: FeedbackRatingCreateDTO): FeedbackRating {
        const timestamp = CommonUtils.getTimestampUTC();
        return {
            ...dto,
            count: 0,
            rating_sum: 0,
            last_modified: timestamp,
            created_on: timestamp
        };
    }

    mapFeedbackRatingUpdateDTO(dto: FeedbackRatingUpdateDTO): FeedbackRatingUpdateDTO {
        const timestamp = CommonUtils.getTimestampUTC();
        return {
            ...dto,
            last_modified: timestamp
        };
    }

    mapAverageRating(entity: FeedbackRating, extended: true): FeedbackRatingExtendedResponseDTO;
    mapAverageRating(entity: FeedbackRating, extended: false): FeedbackRatingResponseDTO;

    mapAverageRating(entity: FeedbackRating, extended: boolean) {
        const newAverage: number = +((entity.rating_sum / entity.count).toFixed(1));
        if(extended) {
            return {
                client_id: entity.client_id,
                count: entity.count,
                rating_sum: entity.rating_sum,
                rating_average: newAverage,
                last_modified: entity.last_modified,
                created_on: entity.created_on
            };
        }
        return { rating_average: newAverage };
    }
}

export default new FeedbackRatingModel();