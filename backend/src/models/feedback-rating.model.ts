import {
    FeedbackRatingCreateDTO,
    FeedbackRatingExtendedResponseDTO,
    FeedbackRatingResponseDTO,
    FeedbackRatingUpdateDTO
} from "../dtos/feedback-rating.dto";
import * as CommonUtils from "../utils/common.utils";
import { FeedbackRating } from "../repositories/interfaces/feedback-rating.entity.interface";

class FeedbackRatingModel {
    generateFeedbackRatingEntity(dto: FeedbackRatingCreateDTO): FeedbackRating {
        const timestamp = CommonUtils.getTimestampUTC();
        return {
            ...dto,
            count: dto.count ?? 0,
            rating_sum: dto.rating_sum ?? 0,
            last_modified: timestamp,
            created_on: timestamp
        };
    }

    mapFeedbackRatingUpdateDTO(dto: FeedbackRatingUpdateDTO): FeedbackRatingUpdateDTO {
        const timestamp = CommonUtils.getTimestampUTC();
        // In case of an updated feedback, rating_average gets updated 
        // => count represents value to be added, not overwritten with.
        return {
            count: dto.count ?? 0,
            rating: dto.rating,
            last_modified: timestamp
        };
    }

    toFeedbackRatingResponseDTO(entity: FeedbackRating, extended: true): FeedbackRatingExtendedResponseDTO;
    toFeedbackRatingResponseDTO(entity: FeedbackRating, extended: false): FeedbackRatingResponseDTO;

    toFeedbackRatingResponseDTO(entity: FeedbackRating, extended: boolean) {
        const delta: number = Number((entity.rating_sum / entity.count).toFixed(1));
        if(extended) {
            return {
                client_id: entity.client_id,
                count: entity.count,
                rating_sum: entity.rating_sum,
                rating_average: delta,
                last_modified: CommonUtils.getTimestampUTC(new Date(entity.last_modified)),
                created_on: CommonUtils.getTimestampUTC(new Date(entity.created_on))
            };
        }
        return { rating_average: delta };
    }

    toFeedbackRatingResponseDTOArray(entities: FeedbackRating[], extended: true): FeedbackRatingExtendedResponseDTO[];
    toFeedbackRatingResponseDTOArray(entities: FeedbackRating[], extended: false): FeedbackRatingResponseDTO[];

    toFeedbackRatingResponseDTOArray(entities: FeedbackRating[], extended: boolean) {
        if(extended) {
            return entities.map(entity => this.toFeedbackRatingResponseDTO(entity, true));
        } else {
            return entities.map(entity => this.toFeedbackRatingResponseDTO(entity, false));
        }
    }
}

export default new FeedbackRatingModel();