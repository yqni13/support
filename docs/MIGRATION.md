## 🆕 $\textsf{\color{salmon}How to add new migration}$

Create a new migration file (ignore or follow name scheme: <target-table>-update<serial_number>.migrations).<br>
This will be saved automatically at [migrations](../../migrations/).
```sh
npx node-pg-migrate create <serial_number>-<target-table>-<create/update/delete>.migrations
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
        // reset to original state
    }
}
```

<br>

## ▶️ $\textsf{\color{salmon}How to run migrations}$

### Since a central db is in use for this project, the migration can be executed locally.

<br>

Set connection string as environment variable in powershell for `local database`:
```sh
path> $env:DATABASE_URL = "postgresql://<user>:<password>@<host>:<port>/<db>"
```
... or for `hosted database` (like Neon):
```sh
path> $env:DATABASE_URL = "postgresql://<user>:<password>@<host>/<db>?sslmode=require"
```

To run migration (direction: 'up' or 'down')
specify number of migrations (going from youngest to oldest) or ignore `count` to run all:

```sh
path> npx node-pg-migrate <direction> <count>

#example (all migrations): npx node-pg-migrate up
#example (precise number): npx node-pg-migrate down 1<br>
```