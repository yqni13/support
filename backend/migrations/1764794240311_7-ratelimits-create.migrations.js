/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
const shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
async function up(pgm) {
    pgm.createTable('rate_limits', {
        rate_limit_id: {
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
        day: {
            type: 'DATE',
            notNull: true
        },
        count: {
            type: 'smallint',
            notNull: true,
            default: 0,
        },
        last_modified: {
            type: 'TIMESTAMP',
            notNull: true
        }
    });
    pgm.sql(`ALTER SEQUENCE rate_limits_rate_limit_id_seq RESTART WITH 1;`);
};

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
async function down(pgm) {
    pgm.dropTable('rate_limits', {
        ifExists: true,
        cascade: true
    })
};

module.exports = { shorthands, up, down };