/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
const shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
async function up(pgm) {
    pgm.createTable('meta', {
        id: {
            type: 'smallserial',
            primaryKey: true
        },
        app: {
            type: 'text',
            unique: true,
            notNull: true,
        },
        author: {
            type: 'text',
            notNull: true
        },
        build_on: {
            type: 'text',
            notNull: true
        },
        environment: {
            type: 'text',
            notNull: true
        },
        app_version: {
            type: 'text',
            notNull: true
        },
        db_version: {
            type: 'text',
            notNull: true
        },
        docker_image: {
            type: 'text',
            notNull: true
        },
        docker_version: {
            type: 'text',
            notNull: true
        },
        jenkins_version: {
            type: 'text',
            notNull: true
        },
        created_on: {
            type: 'timestamp',
            notNull: true
        },
        last_modified: {
            type: 'timestamp',
            notNull: true
        }
    });
};

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
async function down(pgm) {
    pgm.dropTable('meta', {
        ifExists: true,
        cascade: true
    })
};

module.exports = { shorthands, up, down };