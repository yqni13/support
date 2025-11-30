import { QueryResult } from "pg";
import { DBConnection } from "../src/configs/db";

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