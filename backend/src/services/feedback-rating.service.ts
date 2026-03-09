import {
    FeedbackRatingCreateDTO,
    FeedbackRatingExtendedResponseDTO,
    FeedbackRatingResponseDTO,
    FeedbackRatingUpdateDTO
} from "../dtos/feedback-rating.dto";
import { PoolClient } from 'pg';
import feedbackRatingModel from "../models/feedback-rating.model";
import feedbackRatingRepository from "../repositories/feedback-rating.repository";
import { FeedbackRating } from "../repositories/interfaces/feedback-rating.entity.interface";

class FeedbackRatingService {
    private timeMapTargets: string[];

    constructor() {
        this.timeMapTargets = ['last_modified', 'created_on'];
    }

    async getExtendedFeedbackRatingById(id: string): Promise<FeedbackRatingExtendedResponseDTO | null> {
        const result: FeedbackRating | null = await feedbackRatingRepository.findById(id);
        if(!result) {
            return null;
        }
        const newResult = feedbackRatingModel.toFeedbackRatingResponseDTO(result, true);
        return feedbackRatingModel.toFeedbackRatingResponseDTO(newResult, true);
    }

    async getFeedbackRatingByClientName(client_name: string): Promise<FeedbackRatingResponseDTO | null> {
        const result: FeedbackRating | null = await feedbackRatingRepository.findByClientName(client_name);
        if(!result) {
            return null;
        }
        return feedbackRatingModel.toFeedbackRatingResponseDTO(result, false);
    }

    async getAllFeedbackRatings(): Promise<FeedbackRatingExtendedResponseDTO[] | null> {
        const results: FeedbackRating[] | null = await feedbackRatingRepository.findAll();
        if(!results) {
            return null;
        }
        const newResults = 
            results.map((result: FeedbackRating) => feedbackRatingModel.toFeedbackRatingResponseDTO(result, true));
        return feedbackRatingModel.toFeedbackRatingResponseDTOArray(newResults, true);
    }

    /**
     * @description Service function to call only when used within a transaction => needs PoolClient as param.
     */
    async createFeedbackRatingInTa(client: PoolClient, dto: FeedbackRatingCreateDTO): Promise<FeedbackRatingExtendedResponseDTO> {
        const entity: FeedbackRating = feedbackRatingModel.generateFeedbackRatingEntity(dto);
        const result: FeedbackRating = await feedbackRatingRepository.createInTa(client, entity);
        return feedbackRatingModel.toFeedbackRatingResponseDTO(result, true);
    }

    /**
     * @description Service function to call only when used within a transaction => needs PoolClient as param.
     */
    async updateFeedbackRatingInTa(client: PoolClient, id: string, dto: FeedbackRatingUpdateDTO): Promise<FeedbackRatingResponseDTO | null> {
        dto = feedbackRatingModel.mapFeedbackRatingUpdateDTO(dto);
        const result: FeedbackRating | null = await feedbackRatingRepository.updateInTa(client, id, dto);
        if(!result) {
            return null;
        }
        return feedbackRatingModel.toFeedbackRatingResponseDTO(result, false);
    }
}

export default new FeedbackRatingService();