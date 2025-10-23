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
            type: 'TIMESTAMP WITH TIME ZONE',
            notNull: true
        },
        last_modified: {
            type: 'TIMESTAMP WITH TIME ZONE',
            notNull: true
        }
    });
    pgm.sql(`ALTER SEQUENCE meta_id_seq RESTART WITH 1;`);
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