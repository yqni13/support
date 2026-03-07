import { QueryResult } from "pg";
import { DBConnection } from "../src/configs/db";
import { NextFunction, Request, Response } from "express";

type MockClient = {
    query: jest.Mock
}

export function mapMockDbClient(mockResult: any, mockBoolean: boolean = false, mockErrorMsg?: string, expectArray: boolean = false): MockClient {
    let mockClient: MockClient;
    if(mockBoolean) { 
        mockClient = {
            query: jest.fn().mockResolvedValueOnce({
                rowCount: 0 ? false : true
            } as any)
        };
    }
    else if(!mockErrorMsg) {
        mockClient = {
            query: jest.fn().mockResolvedValueOnce({
                rows: expectArray ? mockResult : [mockResult]
            } as QueryResult)
        };
    } else {
        mockClient = { query: jest.fn().mockRejectedValueOnce(new Error(mockErrorMsg))}
    }
    (DBConnection.getInstance as jest.Mock).mockReturnValue({
        connect: jest.fn().mockResolvedValue(mockClient),
        close: jest.fn().mockResolvedValue(undefined)
    });

    return mockClient;
}

export function disableConsoleMessages() {
    jest.spyOn(console, 'info').mockImplementation();
    jest.spyOn(console, 'debug').mockImplementation();
}

/**
 * @description Used in combination with createTestApp() to mock client authentication for flexible testing.
 */
export function injectTestClient(clientId: string) {
    return function (req: Request, res: Response, next: NextFunction) {
        (req as any).apiClients = { client_id: clientId };
        next();
    };
}

/**
 * @description Used in combination with createTestApp() to mock user authentication for flexible testing.
 */
export function injectTestUser(userId: string) {
    return function (req: Request, res: Response, next: NextFunction) {
        (req as any).apiUsers = { user_id: userId };
        next();
    };
}