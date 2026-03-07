import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import { MiddlewareLoader } from "../src/loaders/middleware.loader";

/**
 * 
 * @param middleware Array to inject necessary middleware mocks
 * @param router Express router
 * @param route Api route (example: /api/v1/entity)
 * @returns Mini Express app to simplify testing with injected middleware mocks.
 */
export function createTestApp(middleware: any[], router: any, route: string) {
    const app = express();

    app.use(bodyParser.json());
    app.use(cors());
    app.options("*", cors());

    if(middleware.length > 0) {
        app.use(middleware);
    }

    app.use(route, router);
    MiddlewareLoader.init(app);

    return app;
}