import healthModel from "../../../src/models/health.model"
import { HealthCheckMemory } from "../../../src/services/interfaces/health.interface.service"

describe('Unit-tests (model), priority: HealthCheck', () => {

    describe('Priority: fn checkMemory()', () => {

        describe('Testing valid fn calls', () => {

            test('', () => {
                const mockResult: HealthCheckMemory = {
                    heapUsed: '1MB',
                    heapTotal: '1MB',
                    rss: '1MB'
                };

                jest.spyOn(process, 'memoryUsage').mockReturnValue({
                    heapUsed: 1 * 1024 * 1024,
                    heapTotal: 1 * 1024 * 1024,
                    rss: 1 * 1024 * 1024,
                    external: 0,
                    arrayBuffers: 0
                });

                const testFn = healthModel.checkMemory();

                expect(testFn.heapUsed).toEqual(mockResult.heapUsed);
                expect(testFn.heapTotal).toEqual(mockResult.heapTotal);
                expect(testFn.rss).toEqual(mockResult.rss);
            })
        })
    })
})