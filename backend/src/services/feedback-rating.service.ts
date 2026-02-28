import { FeedbackRatingCreateDTO, FeedbackRatingExtendedResponseDTO, FeedbackRatingResponseDTO, FeedbackRatingUpdateDTO } from "../dtos/feedback-rating.dto";
import feedbackRatingModel from "../models/feedback-rating.model";
import feedbackRatingRepository from "../repositories/feedback-rating.repository";
import { FeedbackRating } from "../repositories/interfaces/feedback-rating.entity.interface";
import * as CommonUtils from "../utils/common.utils";

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
        const newResult = feedbackRatingModel.mapAverageRating(result, true);
        return CommonUtils.mapObjTimestamps<FeedbackRatingExtendedResponseDTO>(newResult, this.timeMapTargets);
    }

    async getFeedbackRatingByClientName(client_name: string): Promise<FeedbackRatingResponseDTO | null> {
        const result: FeedbackRating | null = await feedbackRatingRepository.findByClientName(client_name);
        if(!result) {
            return null;
        }
        return feedbackRatingModel.mapAverageRating(result, false);
    }

    async getAllFeedbackRatings(): Promise<FeedbackRatingExtendedResponseDTO[] | null> {
        const results: FeedbackRating[] | null = await feedbackRatingRepository.findAll();
        if(!results) {
            return null;
        }
        const newResults = results.map((result: FeedbackRating) => feedbackRatingModel.mapAverageRating(result, true));
        return CommonUtils.mapArrayTimestamps<FeedbackRatingExtendedResponseDTO>(newResults, this.timeMapTargets);
    }

    async createFeedbackRating(dto: FeedbackRatingCreateDTO): Promise<FeedbackRating> {
        const entity: FeedbackRating = feedbackRatingModel.generateFeedbackRating(dto);
        const result: FeedbackRating = await feedbackRatingRepository.create(entity);
        return CommonUtils.mapObjTimestamps<FeedbackRating>(result, this.timeMapTargets);
    }

    async updateFeedbackRating(id: string, dto: FeedbackRatingUpdateDTO): Promise<FeedbackRatingResponseDTO | null> {
        dto = feedbackRatingModel.mapFeedbackRatingUpdateDTO(dto);
        const result: FeedbackRating | null = await feedbackRatingRepository.update(id, dto);
        if(!result) {
            return null;
        }
        return feedbackRatingModel.mapAverageRating(result, false);
    }
}

export default new FeedbackRatingService();