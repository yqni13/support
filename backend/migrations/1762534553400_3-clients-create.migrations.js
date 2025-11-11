/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
const shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
async function up(pgm) {
    pgm.createTable('clients', {
        client_id: {
            type: 'uuid',
            primaryKey: true
        },
        name: {
            type: 'text',
            unique: true,
            notNull: true
        },
        api_key_hash: {
            type: 'text',
            notNull: true
        },
        status: {
            type: 'text',
            notNull: true
        },
        last_use: {
            type: 'TIMESTAMP WITH TIME ZONE',
            notNull: true
        },
        last_modified: {
            type: 'TIMESTAMP WITH TIME ZONE',
            notNull: true
        },
        created_on: {
            type: 'TIMESTAMP WITH TIME ZONE',
            notNull: true
        }
    })
};

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
async function down(pgm) {
    pgm.dropTable('clients', {
        ifExists: true,
        cascade: true
    })
};

module.exports = { shorthands, up, down };