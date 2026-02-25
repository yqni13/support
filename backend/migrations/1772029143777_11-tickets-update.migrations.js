/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
const shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
async function up(pgm) {
    pgm.addColumn('tickets', {
        title: {
            type: 'varchar(100)',
            notNull: true,
            default: 'support_ticket'
        },
        info_browser: {
            type: 'varchar(100)',
            notNull: false
        },
        info_os: {
            type: 'varchar(100)',
            notNull: false
        },
        info_device: {
            type: 'varchar(50)',
            notNull: false
        }
    });
    pgm.alterColumn('tickets', 'message', {
        type: 'text',
        notNull: true
    });
}

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
async function down(pgm) {
    pgm.dropColumn('tickets', 'title');
    pgm.dropColumn('tickets', 'info_browser');
    pgm.dropColumn('tickets', 'info_os');
    pgm.dropColumn('tickets', 'info_device');
    pgm.sql(`
        UPDATE tickets
        SET message = left(message, 1000)
        WHERE length(message) > 1000;
    `);
    pgm.alterColumn('tickets', 'message', {
        type: 'varchar(1000)',
        notNull: true
    });
}

module.exports = { shorthands, up, down };