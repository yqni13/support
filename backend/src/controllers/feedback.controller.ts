import { NextFunction, Request, Response } from "express";
import { checkValidation } from "../middleware/validation.middleware";
import { FeedbackCreateDTO, FeedbackFilterDTO, FeedbackResponseDTO } from "../dtos/feedback.dto";
import feedbackService from "../services/feedback.service";

class FeedbackController {
    async getFeedback(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const id = +req.params.id;
            const response: FeedbackResponseDTO | null = await feedbackService.getFeedbackById(id);
            res.json(response);
        } catch(err: any) {
            next(err);
        }
    }

    async postFeedbackEntriesSearch(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const dto: FeedbackFilterDTO = req.body;
            const response: FeedbackResponseDTO[] | null = await feedbackService.searchFeedbackEntriesByFilter(dto);
            res.json(response);
        } catch(err: any) {
            next(err);
        }
    }

    async postFeedback(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const dto: FeedbackCreateDTO = {
                ...req.body,
                client_id: req.apiClients.client_id,
                user_id: req.apiUsers.user_id
            };
            const response: FeedbackResponseDTO | null = await feedbackService.createFeedback(dto);
            res.json(response);
        } catch(err: any) {
            next(err);
        }
    }

    async patchFeedbackReview(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const id = +req.params.id;
            const response: FeedbackResponseDTO | null = await feedbackService.updateFeedbackReview(id);
            res.json(response);
        } catch(err: any) {
            next(err);
        }
    }
}

export default new FeedbackController();