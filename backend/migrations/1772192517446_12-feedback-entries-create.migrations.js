/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
const shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
async function up(pgm) {
    pgm.createTable('feedback_entries', {
        feedback_id: {
            type: 'serial',
            primaryKey: true
        },
        client_id: {
            type: 'uuid',
            notNull: true,
            references: '"clients"(client_id)',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        user_id: {
            type: 'uuid',
            notNull: true,
            references: '"users"(user_id)',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        rating: {
            type: 'smallint',
            notNull: true,
            default: 0
        },
        term_accepted: {
            type: 'boolean',
            notNull: true,
            default: false
        },
        message: {
            type: 'text',
            notNull: false
        },
        reviewed_on: {
            type: 'TIMESTAMP WITH TIME ZONE',
            notNull: false
        },
        last_modified: {
            type: 'TIMESTAMP WITH TIME ZONE',
            notNull: true
        },
        created_on: {
            type: 'TIMESTAMP WITH TIME ZONE',
            notNull: true,
        }
    });
    pgm.createTable('feedback_ratings', {
        client_id: {
            type: 'uuid',
            primaryKey: true,
            references: '"clients"(client_id)',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        count: {
            type: 'integer',
            notNull: true,
            default: 0
        },
        rating_sum: {
            type: 'integer',
            notNull: true,
            default: 0
        },
        last_modified: {
            type: 'TIMESTAMP WITH TIME ZONE',
            notNull: true
        },
        created_on: {
            type: 'TIMESTAMP WITH TIME ZONE',
            notNull: true,
        }
    });
};

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
async function down(pgm) {
    pgm.dropTable('feedback_entries', {
        ifExists: true,
        cascade: true
    });
    pgm.dropTable('feedback_ratings', {
        ifExists: true,
        cascade: true
    });
};

module.exports = { shorthands, up, down };