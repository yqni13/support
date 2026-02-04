/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
const shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
async function up(pgm) {
    pgm.addColumn('meta', {
        maintenance_mode: {
            type: 'varchar(5)',
            notNull: true,
            default: 'A-000'
        }
    })
};

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
async function down(pgm) {
    pgm.dropColumn('meta', 'maintenance_mode');
};

module.exports = { shorthands, up, down };