/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
const shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
async function up(pgm) {
    pgm.createTable('demo_limits', {
        demo_limit_id: {
            type: 'serial',
            primaryKey: true
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
            type: 'TIMESTAMP WITH TIME ZONE',
            notNull: true
        }
    });
    pgm.sql(`ALTER SEQUENCE demo_limits_demo_limit_id_seq RESTART WITH 1;`);
}

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
async function down(pgm) {
    pgm.dropTable('demo_limits', {
        ifExists: true,
        cascade: true
    })
}

module.exports = { shorthands, up, down };