/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
const shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
async function up(pgm) {
    pgm.addColumn('clients', {
        flag: {
            type: 'varchar(30)'
            // notNull: false + default: null ==> default settings
        }
    });
}

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
async function down(pgm) {
    pgm.dropColumn('clients', 'flag');
}

module.exports = { shorthands, up, down };