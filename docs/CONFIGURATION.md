## 🔑 $\textsf{\color{salmon}.env Setup}$

### Additional information to set `.env` up correctly :

| Key | Information |
|-----|-------------|
| SECRET_ADMIN_KEY | free to create yourself |
| SECRET_NOTIFY_...| create Telegram Bot and use credentials |
| SECRET_DB_TEST_.... | use default data for all DB_TEST vars or [see setup](../backend/tests/db-migrations.setup.ts) |
| SECRET_TEST_APIKEY_RAW | use RAW from generateApiKeyObj() [see model](../backend/src/models/clients.model.ts) |
| SECRET_TEST_APIKEY_HASH | use HASH from same function as RAW |
| SECRET_EMAIL_PASS | password from SENDER email |

