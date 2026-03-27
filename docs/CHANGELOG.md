## 📜 $\textsf{\color{salmon}{List\ of\ updates}}$


### $\textsf{\color{skyblue}2026/03/26}$

$\textsf{[v1.5.2\ =>\ {\textbf{\color{brown}v1.6.0}]}}$ app<br>
- $\textsf{\color{teal}Addition:}$ Added health endpoints to improve health checks (manually + cron-jobs).

<br>

### $\textsf{\color{skyblue}2026/03/25}$

$\textsf{[v1.4.9\ =>\ v1.5.2]}$ app<br>
- $\textsf{\color{teal}Addition:}$ Added notification service to inform admin about specified events.
- $\textsf{\color{orange}Patch:}$ Updated:
  + env variables in connection with notifications (addition/deletion).
  + return values of DTO's for entities 'tickets' and 'feedback'.

<br>

### $\textsf{\color{skyblue}2026/03/14}$

$\textsf{[v1.4.4\ =>\ v1.4.9]}$ app<br>
- $\textsf{\color{teal}Addition:}$ Added form-data parser middleware for requests including files.
- $\textsf{\color{orange}Patch:}$ Updated:
  + return types, mapping and handling (part 1).
  + calculation for delete-permission by comparing timestamps (incorporate timezone offset on database read timestamp).
  + 'tickets' request: more accurate check for containing files.
  + use Promise-instance fn finally() in repository-layer to reduce code.
  + documentation headers and display error on symbol (&).

<br>

### $\textsf{\color{skyblue}2026/03/09}$

$\textsf{[v1.4.1\ =>\ v1.4.4]}$ app<br>
- $\textsf{\color{orange}Patch:}$ Updated:
  + entity ID's are using now nominal types instead basic string|number.
  + some model functions are renamed to keep consistency and improve readability.
  + some api routes have been shortened to keep consistency and improve readability.

<br>

### $\textsf{\color{skyblue}2026/03/07}$

$\textsf{[v1.3.5\ =>\ v1.4.1]}$ app<br>
$\textsf{[v1.5.4\ =>\ {\textbf{\color{brown}v1.6.0}]}}$ database
- $\textsf{\color{teal}Addition:}$ Added api route + logic for Feedback/FeedbackRating to add new feedback/rating or get current average rating value.
- $\textsf{\color{orange}Patch:}$ Updated:
  + testing whole process (request-to-response) with individual injection of middlewares when necessary.
  + database with new migration to add tables 'feedback_entries' and 'feedback_ratings' to handle single feedback/ratings seperately from accumulated average rating.

<br>

### $\textsf{\color{skyblue}2026/02/26}$

$\textsf{[v1.3.4\ =>\ v1.3.5]}$ app<br>
$\textsf{[v1.5.3\ =>\ v1.5.4]}$ database
- $\textsf{\color{orange}Patch:}$ Updated:
  +  new migration to add properties 'info_browser', 'info_os' and 'info_device' as well as property 'title' with default value 'support_ticket' to table 'tickets' and increased max length of property 'message' up to 5000 characters
  +  ticket validation/handling/tests to inlcude new & changed properties

<br>

### $\textsf{\color{skyblue}2026/02/25}$

$\textsf{[v1.3.3\ =>\ v1.3.4]}$ app
- $\textsf{\color{orange}Patch:}$ Updated exceptions for auth class and adapted auth middleware exception handling.

<br>

### $\textsf{\color{skyblue}2026/02/18}$

$\textsf{[v1.3.1\ =>\ v1.3.3]}$ app
- $\textsf{\color{orange}Patch:}$ Removed unused exceptions.
- $\textsf{\color{red}Bugfix:}$ Extracting meta data from package.json works now as expected. [Before: Extracting data from file needs to get its path first and this path was read via "fs.readFileSync(path.resolve(__dirname, '../file')" which works only when root doesn't change, which happens in env:prod => use process.cwd() to search path dynamically.]

<br>

### $\textsf{\color{skyblue}2026/02/15}$

$\textsf{[v1.2.2\ =>\ v1.3.1]}$ app
- $\textsf{\color{teal}Addition:}$ Added test route to manually trigger exceptions for testing and UI translation checks.
- $\textsf{\color{orange}Patch:}$ Moved /demo requests from 'meta' route to new 'test' route.

<br>

### $\textsf{\color{skyblue}2026/02/14}$

$\textsf{[v1.2.1\ =>\ v1.2.2]}$ app
- $\textsf{\color{orange}Patch:}$ Refactored test files (describe/test texts, consistent ID-usage, sum single tests in test.each loop).

<br>

### $\textsf{\color{skyblue}2026/02/12}$

$\textsf{[v1.1.0\ =>\ v1.2.1]}$ app<br>
$\textsf{[v1.5.2\ =>\ v1.5.3]}$ database
- $\textsf{\color{teal}Addition:}$ Added options to select category of support ticket regarding user intention.
- $\textsf{\color{orange}Patch:}$ Updated:
  + throw exception when deletion is prohibited instead of returning 'false'
  + migration to add 'option' to table 'tickets' with default value 'support'

<br>

### $\textsf{\color{skyblue}2026/02/11}$

$\textsf{[v1.0.0\ =>\ v1.1.0]}$ app
- $\textsf{\color{teal}Addition:}$ Added deletion to file handling (admin only) + delete-permission check.

<br>

### $\textsf{\color{skyblue}2026/02/09}$

$\textsf{[v1.0.0-beta.3\ =>\ v1.0.0]}$ app
- $\textsf{\color{teal}Addition:}$ Added file handling (tickets create) + cloud upload.

<br>

### $\textsf{\color{skyblue}2026/02/05}$

$\textsf{[v1.0.0-beta.2\ =>\ v1.0.0-beta.3]}$ app
- $\textsf{\color{orange}Patch:}$ Refactored and renamed validation files, added basic files validation (not completed) and interfaces.

<br>

### $\textsf{\color{skyblue}2026/02/03}$

$\textsf{[v1.0.0-beta.1\ =>\ v1.0.0-beta.2]}$ app
- $\textsf{\color{orange}Patch:}$ Updated:
  + rate-limit rule "TotalDailyLimitRule" by adding penalty
  + penalties by adding violation for maintenance (context: traffic)

<br>

### $\textsf{\color{skyblue}2026/01/22}$

$\textsf{[v0.12.1\ =>\ v1.0.0-beta.1]}$ app<br>
$\textsf{[v1.5.1\ =>\ v1.5.2]}$ database
- $\textsf{\color{teal}Addition:}$ Added version based data to file 'package.json' for main usage (static in-memory) => first official beta version 🎉.
- $\textsf{\color{orange}Patch:}$ Updated:
  + logger to use version data in central configuration (defaultMeta).
  + version validation to enable pre-release structures (SemVer Specification 9).
  + maintenance mode options (additional mode for blocking by penalty for traffic).
  + migration to add 'maintenance_mode' to table 'meta' with the new correct default value ('E-000' => 'A-000').

<br>

### $\textsf{\color{skyblue}2025/12/25}$

$\textsf{[v0.12.0\ =>\ v0.12.1]}$ app<br>
- $\textsf{\color{orange}Patch:}$ Refactored clients response mapping.

<br>

### $\textsf{\color{skyblue}2025/12/22}$

$\textsf{[v0.11.1\ =>\ v0.12.0]}$ app<br>
$\textsf{[v1.5.0\ =>\ v1.5.1]}$ database
- $\textsf{\color{teal}Addition:}$ Added logic to handle penalties (limit violations only currently).
- $\textsf{\color{orange}Patch:}$ Added migration to update 'clients' table by adding 'flag' property.

<br>

### $\textsf{\color{skyblue}2025/12/16}$

$\textsf{[v0.10.0\ =>\ v0.11.1]}$ app<br>
$\textsf{[v1.4.1\ =>\ v1.5.0]}$ database
- $\textsf{\color{teal}Addition:}$ Added logic to handle demo request rates + limit violations.
- $\textsf{\color{teal}Addition:}$ Migrated 'demo_limits' table to database + service/repository logic.
- $\textsf{\color{orange}Patch:}$ Added 'retryAfter' timestamp to exception for limit violations.

<br>

### $\textsf{\color{skyblue}2025/12/14}$

$\textsf{[v0.9.10\ =>\ v0.10.0]}$ app<br>
$\textsf{[v1.4.0\ =>\ v1.4.1]}$ database
- $\textsf{\color{teal}Addition:}$ Added logic to observe request rates and handle limit violations.
- $\textsf{\color{orange}Patch:}$ Refactored migration 'rate_limits' due to wrong type of 'last_modified'.

<br>

### $\textsf{\color{skyblue}2025/12/08}$

$\textsf{[v1.0.5\ =>\ {\textbf{\color{brown}v1.0.6}]}}$ docker
- $\textsf{\color{orange}Patch:}$ Refactored Dockerfile because of wrong path on execution command for 'production' stage.

<br>

### $\textsf{\color{skyblue}2025/12/06}$

$\textsf{[v0.9.9\ =>\ v0.9.10]}$ app
- $\textsf{\color{teal}Addition:}$ Added tests to check middleware functions.

<br>

### $\textsf{\color{skyblue}2025/12/05}$

$\textsf{[v0.9.8\ =>\ v0.9.9]}$ app
- $\textsf{\color{green}Change:}$ Updated filtered search of entities 'users' and 'tickets' to optionally query on timespan for last changed/created timestamps.

<br>

### $\textsf{\color{skyblue}2025/12/03}$

$\textsf{[v0.9.7\ =>\ v0.9.8]}$ app<br>
$\textsf{[v1.3.1\ =>\ v1.4.0]}$ database<br>
$\textsf{[v1.0.3\ =>\ v1.0.5]}$ docker
- $\textsf{\color{teal}Addition:}$ Added insert command to testcontainers ('rate_limits' table).
- $\textsf{\color{teal}Addition:}$ Migrated 'rate_limits' table to database (no logic).
- $\textsf{\color{orange}Patch:}$ Refactored Dockerfile (wrong 'omit' flag) and Docker Compose (missing target for local execution).

<br>

### $\textsf{\color{skyblue}2025/12/01}$

$\textsf{[v0.9.6\ =>\ v0.9.7]}$ app
- $\textsf{\color{teal}Addition:}$ Added config file for hosting service 'Vercel' to deploy application in 'staging' environment.

<br>

### $\textsf{\color{skyblue}2025/11/28}$

$\textsf{[v0.9.4\ =>\ v0.9.6]}$ app
- $\textsf{\color{teal}Addition:}$ Added '/meta/demo' route for demonstration and manual testing reasons.
- $\textsf{\color{orange}Patch:}$ Refactored error- and validation-middleware to correctly validate empty and undefined payloads.

<br>

### $\textsf{\color{skyblue}2025/11/27}$

$\textsf{[v0.9.3\ =>\ v0.9.4]}$ app
- $\textsf{\color{orange}Patch:}$ Refactored and integrated logger on necessary hotspots (catch-blocks).

<br>

### $\textsf{\color{skyblue}2025/11/26}$

$\textsf{[v0.9.2\ =>\ v0.9.3]}$ app
- $\textsf{\color{orange}Patch:}$ Refactored error handling and return values for entities 'clients', 'users' and 'meta'.

<br>

### $\textsf{\color{skyblue}2025/11/25}$

$\textsf{[v0.9.1\ =>\ v0.9.2]}$ app
- $\textsf{\color{orange}Patch:}$ Refactored process of registering new user by assigning default values in business layer (model).

<br>

### $\textsf{\color{skyblue}2025/11/24}$

$\textsf{[v0.8.5\ =>\ v0.9.1]}$ app
- $\textsf{\color{orange}Patch:}$ Updated tests, mock-data handling and added findByEmail to 'users' repository methods. 
- $\textsf{\color{teal}Addition:}$ Added routes + basic logic to handle 'Tickets' data.

<br>

### $\textsf{\color{skyblue}2025/11/21}$

$\textsf{[v0.8.2\ =>\ v0.8.5]}$ app
- $\textsf{\color{orange}Patch:}$ Refactored timestamp mapping from different model functions to two generic type handling helper functions.
- $\textsf{\color{orange}Patch:}$ Updated validations and added tests for params-located arguments (checked only body-located arguments before).
- $\textsf{\color{teal}Addition:}$ Added validation on create method of entity 'Clients' to check if name already exists in database (unique constraint).

<br>

### $\textsf{\color{skyblue}2025/11/20}$

$\textsf{[v0.8.1\ =>\ v0.8.2]}$ app<br>
$\textsf{[v1.3.0\ =>\ v1.3.1]}$ database<br>
$\textsf{[v1.0.2\ =>\ v1.0.3]}$ docker
- $\textsf{\color{orange}Patch:}$ Updated timestamp handling without timezone in backend (db saves with timezone and only converts in Frontend).
- $\textsf{\color{orange}Patch:}$ Added migration to change type for timestamps of table 'users' and 'tickets'.
- $\textsf{\color{green}Change:}$ Removed timezone setting from docker due to UTC-Update.

<br>

### $\textsf{\color{skyblue}2025/11/18}$

$\textsf{[v0.7.6\ =>\ v0.8.1]}$ app
- $\textsf{\color{green}Change:}$ Added 'issued' state to ticket status enum (default).
- $\textsf{\color{teal}Addition:}$ Added routes + basic logic to handle 'Users' data.

<br>

### $\textsf{\color{skyblue}2025/11/17}$

$\textsf{[v0.7.4\ =>\ v0.7.6]}$ app<br>
$\textsf{[v1.2.0\ =>\ v1.3.0]}$ database
- $\textsf{\color{teal}Addition:}$ Added customized email validation.
- $\textsf{\color{teal}Addition:}$ Added enum to handle ticket status.
- $\textsf{\color{teal}Addition:}$ Added insert command to testcontainers ('tickets' table).
- $\textsf{\color{teal}Addition:}$ Migrated 'tickets' table to database (no logic).

<br>

### $\textsf{\color{skyblue}2025/11/16}$

$\textsf{[v0.7.3\ =>\ v0.7.4]}$ app<br>
$\textsf{[v1.1.0\ =>\ v1.2.0]}$ database
- $\textsf{\color{teal}Addition:}$ Added enums to handle flags and user status.
- $\textsf{\color{teal}Addition:}$ Added insert command to testcontainers ('users' table).
- $\textsf{\color{teal}Addition:}$ Migrated 'users' table to database (no logic).

<br>

### $\textsf{\color{skyblue}2025/11/15}$

$\textsf{[v0.7.2\ =>\ v0.7.3]}$ app
- $\textsf{\color{teal}Addition:}$ Added new middleware to observe and check requests fulfilling or infringing certail rules like rate-limits and activates maitenance mode in emergency (no logic at the moment, only blueprint).

<br>

### $\textsf{\color{skyblue}2025/11/11}$

$\textsf{[v0.7.1\ =>\ v0.7.2]}$ app<br>
$\textsf{[v1.0.1\ =>\ v1.0.2]}$ docker<br>
- $\textsf{\color{teal}Addition:}$ Added script to run tests on GitHub PR's (feat* => DEV, DEV => STAG, STAG => PROD).
- $\textsf{\color{orange}Patch:}$ Updated docker-compose with additional env var (set timezone to fix difference between local system and docker container).

<br>

### $\textsf{\color{skyblue}2025/11/10}$

$\textsf{[v0.7.0\ =>\ v0.7.1]}$ app<br>
- $\textsf{\color{orange}Patch:}$ Updated admin authentication by key from header.

<br>

### $\textsf{\color{skyblue}2025/11/09}$

$\textsf{[v0.5.1\ =>\ v0.7.0]}$ app<br>
$\textsf{[v1.0.1\ =>\ v1.1.0]}$ database
- $\textsf{\color{teal}Addition:}$ Added verification middleware to validate requests by api-keys.
- $\textsf{\color{teal}Addition:}$ Migrated 'clients' table to database and added logic to handle status changes and api-key verifications.

<br>

### $\textsf{\color{skyblue}2025/11/06}$

$\textsf{[v0.5.0\ =>\ v0.5.1]}$ app<br>
$\textsf{[v1.0.0\ =>\ v1.0.1]}$ docker
- $\textsf{\color{orange}Patch:}$ Updated secret variables to simplify settings on STAG/PROD environments.

<br>

### $\textsf{\color{skyblue}2025/11/05}$

$\textsf{[v0.4.0\ =>\ v0.5.0]}$ app<br>
$\textsf{[v0.0.0\ =>\ v1.0.0]}$ docker
- $\textsf{\color{teal}Addition:}$ Added Docker configuration to run application in container (local only at the moment).

<br>

### $\textsf{\color{skyblue}2025/11/03}$

$\textsf{[v0.3.1\ =>\ v0.4.0]}$ app<br>
$\textsf{[v1.0.0\ =>\ v1.0.1]}$ database
- $\textsf{\color{teal}Addition:}$ Added maintenance middleware and modified database + logic to handle maintenance status via request (instead of env variables).

<br>

### $\textsf{\color{skyblue}2025/10/26}$

$\textsf{[v0.3.0\ =>\ v0.3.1]}$ app
- $\textsf{\color{orange}Patch:}$ Updated timestamp handling to incorporate timezone offsets.

<br>

### $\textsf{\color{skyblue}2025/10/22}$

$\textsf{[v0.2.2\ =>\ v0.3.0]}$ app
- $\textsf{\color{teal}Addition:}$ Added new test setup including now ephemeral databases via testcontainer.

<br>

### $\textsf{\color{skyblue}2025/10/04}$

$\textsf{[v0.2.1\ =>\ v0.2.2]}$ app
- $\textsf{\color{teal}Addition:}$ Added authentication middleware (to check validity by api key).

<br>

### $\textsf{\color{skyblue}2025/10/02}$

$\textsf{[v0.1.0\ =>\ v0.2.1]}$ app<br>
$\textsf{[v0.0.0\ =>\ v1.0.0]}$ database
- $\textsf{\color{orange}Patch:}$ Updated typescript configuration to include jest testing-framework.
- $\textsf{\color{teal}Addition:}$ Added 'meta' handling in addition to full db setup.

<br>

### $\textsf{\color{skyblue}2025/09/26}$

$\textsf{[v0.1.0\ =>\ v0.1.1]}$ app
- $\textsf{\color{teal}Addition:}$ Added basic meta route.
- $\textsf{\color{green}Change:}$ Switched from NodeJS by Javascript to Typescript.
- $\textsf{\color{green}Change:}$ Adjusted migration documentation for correct terminal commands.

<br>

### $\textsf{\color{skyblue}2025/08/02}$

$\textsf{[v0.0.0\ =>\ v0.0.1]}$ app
- $\textsf{\color{teal}Addition:}$ Added basic documentation.