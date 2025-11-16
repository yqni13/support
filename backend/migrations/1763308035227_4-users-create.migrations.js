/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
const shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
async function up(pgm) {
    pgm.createTable('users', {
        user_id: {
            type: 'uuid',
            primaryKey: true
        },
        email: {
            type: 'varchar(318)',
            notNull: true,
            unique: true
        },
        status: {
            type: 'varchar(30)',
            notNull: true
        },
        flag: {
            type: 'varchar(30)',
            notNull: false
        },
        last_modified: {
            type: 'TIMESTAMP',
            notNull: true
        },
        created_on: {
            type: 'TIMESTAMP',
            notNull: true
        }
    })
};

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
async function down(pgm) {
    pgm.dropTable('users', {
        ifExists: true,
        cascade: true
    })
};

module.exports = { shorthands, up, down };