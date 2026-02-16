import { TestDemoDTO, TestErrorDTO } from './../dtos/test.dto';
import { checkValidation } from "../middleware/validation.middleware";
import { NextFunction, Request, Response } from "express";
import testService from '../services/test.service';

class TestController {
    async postError(req: Request, _: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const dto: TestErrorDTO = req.body;
            await testService.searchExceptionThrow(dto);
        } catch(err: any) {
            next(err);
        }
    }

    async postDemo(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const dto: TestDemoDTO = req.body;
            const response: Record<string, string> = await testService.searchDemoByPayload(dto);
            res.json(response);
        } catch(err: any) {
            next(err);
        }
    }
}

export default new TestController();