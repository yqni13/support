import { NextFunction, Request, Response } from "express";
import { checkValidation } from "../middleware/validation.middleware";
import feedbackRatingService from "../services/feedback-rating.service";
import { FeedbackRatingCreateDTO, FeedbackRatingExtendedResponseDTO, FeedbackRatingResponseDTO } from "../dtos/feedback-rating.dto";
import { FeedbackRating } from "../repositories/interfaces/feedback-rating.entity.interface";

class FeedbackRatingController {
    async getExtendedFeedbackRating(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const id = req.params.id;
            const response: FeedbackRatingExtendedResponseDTO | null = await feedbackRatingService.getExtendedFeedbackRatingById(id);
            res.json(response);
        } catch(err: any) {
            next(err);
        }
    }

    async getFeedbackRating(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const client_name = req.params.client_name;
            const response: FeedbackRatingResponseDTO | null = await feedbackRatingService.getFeedbackRatingByClientName(client_name);
            res.json(response);
        } catch(err: any) {
            next(err);
        }
    }

    async getAllFeedbackRatings(req: Request, res: Response, next: NextFunction) {
        try {
            const response: FeedbackRatingExtendedResponseDTO[] | null = await feedbackRatingService.getAllFeedbackRatings();
            res.json(response);
        } catch(err: any) {
            next(err);
        }
    }

    async postFeedbackRating(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const dto: FeedbackRatingCreateDTO = req.body;
            const response: FeedbackRating = await feedbackRatingService.createFeedbackRating(dto);
            res.json(response);
        } catch(err: any) {
            next(err);
        }
    }
}

export default new FeedbackRatingController();