/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
const shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
async function up(pgm) {
    // Table: Users
    pgm.alterColumn('users', 'last_modified', {
        type: 'TIMESTAMP WITH TIME ZONE',
        notNull: true,
        using: '"last_modified"::timestamptz'
    });
    pgm.alterColumn('users', 'created_on', {
        type: 'TIMESTAMP WITH TIME ZONE',
        notNull: true,
        using: '"created_on"::timestamptz'
    });

    // Table: Tickets
    pgm.alterColumn('tickets', 'last_modified', {
        type: 'TIMESTAMP WITH TIME ZONE',
        notNull: true,
        using: '"last_modified"::timestamptz'
    });
    pgm.alterColumn('tickets', 'created_on', {
        type: 'TIMESTAMP WITH TIME ZONE',
        notNull: true,
        using: '"created_on"::timestamptz'
    })
};

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
async function down(pgm) {
    // Table: Users
    pgm.alterColumn('users', 'last_modified', {
        type: 'TIMESTAMP',
        notNull: true,
        using: '"last_modified"::timestamp'
    });
    pgm.alterColumn('users', 'created_on', {
        type: 'TIMESTAMP',
        notNull: true,
        using: '"created_on"::timestamp'
    });

    // Table: Tickets
    pgm.alterColumn('tickets', 'last_modified', {
        type: 'TIMESTAMP',
        notNull: true,
        using: '"last_modified"::timestamp'
    });
    pgm.alterColumn('tickets', 'created_on', {
        type: 'TIMESTAMP',
        notNull: true,
        using: '"created_on"::timestamp'
    })

    await pgm.db.query(`
        UPDATE users
            SET last_modified = '2025-11-20 11:00:00', created_on = '2025-11-20 11:00:00';
    `);
    await pgm.db.query(`
        UPDATE tickets
            SET last_modified = '2025-11-20 11:00:00', created_on = '2025-11-20 11:00:00';
    `);
};

module.exports = { shorthands, up, down };