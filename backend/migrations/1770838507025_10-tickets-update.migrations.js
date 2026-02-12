/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
const shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
async function up(pgm) {
    pgm.addColumn('tickets', {
        option: {
            type: 'varchar(30)',
            notNull: true,
            default: 'support'
        }
    });
}

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
async function down(pgm) {
    pgm.dropColumn('tickets', 'option');
}

module.exports = { shorthands, up, down };