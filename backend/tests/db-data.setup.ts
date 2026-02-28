import { BaseQuery } from "../src/repositories/interfaces/common.repository.interface";
import { ApiKeyStatus } from "../src/utils/enums/api-key-status.enum";
import { DeviceOption } from "../src/utils/enums/device-option.enum";
import { MaintenanceMode } from "../src/utils/enums/maintenance-mode.enum";
import { TicketOption } from "../src/utils/enums/ticket-option.enum";
import { TicketStatus } from "../src/utils/enums/ticket-status.enum";
import { UserStatus } from "../src/utils/enums/user-status.enum";
import { secrets } from "../src/utils/secrets.utils";
import { default as mockId } from "./mock-data/id.mock-data.json";

export class DBTestData {
    private static instance: DBTestData;
    private tableRecords: Record<string, string>;

    constructor() {
        this.tableRecords = {
            meta: 'meta',
            clients: 'clients',
            users: 'users',
            tickets: 'tickets',
            rateLimits: 'rate_limits',
            demoLimits: 'demo_limits',
            feedback: 'feedback_entries',
            feedbackRating: 'feedback_ratings'
        };
    }

    static getInstance(): DBTestData {
        if(!DBTestData.instance) {
            DBTestData.instance = new DBTestData();
        }
        return DBTestData.instance;
    }

    getDatabaseTables(): string[] {
        return Object.values(this.tableRecords).map((table: string) => table);
    }

    getMetaInsertSql(): BaseQuery {
        // No need for id (serial) control because of no testing with INSERT or DELETE.
        const sql = `INSERT INTO ${this.tableRecords['meta']}
        (id, app, author, build_on, environment, app_version, db_version, docker_image, docker_version, jenkins_version, maintenance_mode, created_on, last_modified)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);
        `;
        const values = [1, 'support', 'yqni13', '2025-01-01T14:00:01.000Z', 'test', '0.0.1', '0.0.2', 'no-image', '0.0.3', '0.0.4', MaintenanceMode.A000, '2025-01-01T14:00:01.000Z', '2025-01-01T14:00:01.000Z'];
        return { sql: sql, values: values };
    }

    getClientsInsertSql(): BaseQuery {
        const sql = `INSERT INTO ${this.tableRecords['clients']}
        (client_id, name, api_key_hash, status, flag, last_use, last_modified, created_on)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
        `;
        const values = [mockId.clients.valid[0], 'TESTCLIENT', secrets.TEST_APIKEY_HASH, ApiKeyStatus.ACTIVE, null, '2025-01-01T14:00:02.000Z', '2025-01-01T14:00:02.000Z', '2025-01-01T14:00:02.000Z'];
        return { sql: sql, values: values };
    }

    getAdditionalClientsInsertSql(): BaseQuery {
        const sql = `INSERT INTO ${this.tableRecords['clients']}
        (client_id, name, api_key_hash, status, flag, last_use, last_modified, created_on)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
        `;
        const values = [mockId.clients.valid[1], 'ANOTHER-TESTCLIENT', secrets.TEST_APIKEY_HASH, ApiKeyStatus.ACTIVE, null, '2025-01-01T14:00:02.000Z', '2025-01-01T14:00:02.000Z', '2025-01-01T14:00:02.000Z'];
        return { sql: sql, values: values };
    }

    getUsersInsertSql(): BaseQuery {
        const sql = `INSERT INTO ${this.tableRecords['users']}
        (user_id, email, status, flag, last_modified, created_on)
        VALUES ($1, $2, $3, $4, $5, $6);
        `;
        const values = [mockId.users.valid[0], 'max.mustermann@yqni13.com', UserStatus.ACTIVE, null, '2025-01-01T14:00:03.000Z', '2025-01-01T14:00:03.000Z'];
        return { sql: sql, values: values };
    }

    getTicketsInsertSql(): BaseQuery {
        const sql = `INSERT INTO ${this.tableRecords['tickets']}
        (ticket_id, client_id, user_id, status, option, title, message, resource_paths, flag, info_browser, info_os, info_device, last_modified, created_on)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14);
        `;
        const values = [mockId.tickets.valid[0], mockId.clients.valid[0], mockId.users.valid[0], TicketStatus.ISSUED, TicketOption.SUPPORT, 'test-title', 'test-message', ['test/path/num0', 'test/path/num1'], null, 'Brave 1.87.190 (Official Build) (64-Bit)', 'Windows 11', DeviceOption.COMPUTER, '2025-01-01T14:00:04.000Z', '2025-01-01T14:00:04.000Z'];
        return { sql: sql, values: values };
    }

    getRateLimitsInsertSql(): BaseQuery {
        const sql = `INSERT INTO ${this.tableRecords['rateLimits']}
        (client_id, user_id, day, count, last_modified)
        VALUES ($1, $2, $3, $4, $5);
        `;
        const values = [mockId.clients.valid[0], mockId.users.valid[0], '2025-01-01', 1, '2025-01-01T14:00:05.000Z'];
        return { sql: sql, values: values };
    }

    getDemoLimitsInsertSql(): BaseQuery {
        const sql = `INSERT INTO ${this.tableRecords['demoLimits']}
        (day, count, last_modified)
        VALUES ($1, $2, $3);
        `;
        const values = ['2025-01-01', 1, '2025-01-01T14:00:06.000Z'];
        return { sql: sql, values: values }; 
    }

    getTicketsWithoutPathsInsertSql(): BaseQuery {
        const sql = `INSERT INTO ${this.tableRecords['tickets']}
        (ticket_id, client_id, user_id, status, option, title, message, resource_paths, flag, info_browser, info_os, info_device, last_modified, created_on)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14);
        `;
        const values = [mockId.tickets.valid[1], mockId.clients.valid[0], mockId.users.valid[0], TicketStatus.ISSUED, TicketOption.SUPPORT, 'test-title', 'test-message-without-resource_paths', undefined, null, 'Brave 1.87.190 (Official Build) (64-Bit)', 'Android 15', DeviceOption.MOBILE, '2025-01-01T14:00:07.000Z', '2025-01-01T14:00:07.000Z'];
        return { sql: sql, values: values };
    }

    getFeedbackInsertSql(): BaseQuery {
        const sql = `INSERT INTO ${this.tableRecords['feedback']}
        (feedback_id, client_id, user_id, rating, term_accepted, message, reviewed_on, last_modified, created_on)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
        `;
        const values = [mockId.feedback.valid[0], mockId.clients.valid[0], mockId.users.valid[0], 5, true, 'test-feedback-message', '2025-01-01T14:00:08.000Z', '2025-01-01T14:00:08.000Z', '2025-01-01T14:00:08.000Z'];
        return { sql: sql, values: values };
    }

    getFeedbackRatingInsertSql(): BaseQuery {
        const sql = `INSERT INTO ${this.tableRecords['feedbackRating']}
        (client_id, count, rating_sum, last_modified, created_on)
        VALUES ($1, $2, $3, $4, $5);
        `;
        const values = [mockId.clients.valid[0], 16, 67, '2025-01-01T14:00:09.000Z', '2025-01-01T14:00:09.000Z'];
        return { sql: sql, values: values };
    }
}