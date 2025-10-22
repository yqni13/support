/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
const shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
async function up(pgm) {
    await pgm.db.query(`
        INSERT INTO meta
        (id, app, author, build_on, environment, app_version, db_version, docker_image, docker_version, jenkins_version, created_on, last_modified)
        VALUES (DEFAULT, 'support', 'yqni13', '2025-01-01T00:00:01.000', 'development', '0.0.0', '0.0.0', 'no-image', '0.0.0', '0.0.0', '2025-01-01 00:00:01+00', '2025-01-01 00:00:01+00')
    `);
};

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
async function down(pgm) {
    await pgm.db.query(`
        DELETE FROM meta
        WHERE app = 'support'
    `)
};

module.exports = { shorthands, up, down };