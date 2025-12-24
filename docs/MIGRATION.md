## How to migrate?

Create a new migration file (name scheme: <target-table>-update<serial_number>.migrations).<br>This will be saved automatically at [migrations](../../migrations/).
```sh
npm run migrate create <serial_number>-<target-table>-<create/update/delete>.migrations
```


Adapt new migration file on `up` (target changes) and `down` (reset to current state).
```sh
const shorthands = undefined;

module.exports = {
    shorthands,
    up: (pgm) => {
        // alter, drop, rename, add tables or columns
    }
}

module.exports = {
    shorthands,
    down: (pgm) => {
        // reset to current state
    }
}
```

Since a central db is in use for this project, the migration can be executed locally.

Set connection string as environment variable by the following command in powershell<br>
local database:
```sh
path> $env:DATABASE_URL = "postgresql://<user>:<password>@<host>:<port>/<db>"
```
hosted database (like Neon):
```sh
path> $env:DATABASE_URL = "postgresql://<user>:<password>@<host>/<db>?sslmode=require"
```

(direction: 'up' or 'down')
for specific number of migrations (going from youngest to oldest):

```sh
path> npx node-pg-migrate <direction> <count> #==> npx node-pg-migrate down 9999
or
path> npm run migrate-<direction> <count>
```

or, running all migrations including specified one (up/down, migration file `without .js`):

```sh
path> $env:DATABASE_URL = <local_or_cloud_version>
path> npx node-pg-migrate <direction> <migration-number>_<migration-name>
```

<br>

Check database on correct changes and reset type in `package.json`.