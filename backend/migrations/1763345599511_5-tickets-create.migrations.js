/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
const shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
async function up(pgm) {
    pgm.createTable('tickets', {
        ticket_id: {
            type: 'uuid',
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
        status: {
            type: 'varchar(30)',
            notNull: true
        },
        message: {
            type: 'varchar(1000)',
            notNull: true
        },
        resource_paths: {
            type: 'text[]',
            notNull: false
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
    pgm.dropTable('tickets', {
        ifExists: true,
        cascade: true
    })
};

module.exports = { shorthands, up, down };