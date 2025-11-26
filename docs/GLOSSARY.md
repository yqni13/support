# 📜 GLOSSARY 📜

Guidelines to handle common naming schemas.<br>
Consistency within these rules improve readability, maintenance and modular development.

<br>

## 🈹 Prefix (Decorators)

| Prefix    | Description                                    |
|-----------|------------------------------------------------|
| `support` | global/reusable components/directives (common) |
| `app`     | feature-specific components (modules)          |
| `SUPPORT` | custom request headers (middleware)            |

<br>


## 🈯 File naming

Basic description: `<base>.<subsuffix?>.<suffix>.<ending>` [specific always singular]

| Classification    | Structure                             | Example                            |
|-------------------|---------------------------------------|------------------------------------|
| Controllers       | `[base].controller.js`                | mailing.controller.js              |
| Loaders           | `[base].loader.js`                    | express.loader.js                  |
| Middleware        | `[base].model.js`                     | error.middleware.js                |
| Validators        | `[base]Validator.middleware.js`       | mailingValidator.middleware.js     |
| Models            | `[base].model.js`                     | mailing.model.js                   |
| Routes            | `[base].routes.js`                    | mailing.routes.js                  |
| Services          | `[base].service.[ending]`             | mailing.service.js/ts              |
| Utils             | `[base].utils.[ending]`               | common.utils.js/ts                 |
| Mock data         | `[base].mock.json`                    | mailing.mock.json                  |
| Enums             | `[base].enum.[ending]`                | snackbar-options.enum.js/ts        |
| Integration-Tests | `[base].integration.test.js`          | mailing.integration.test.js        |
| Unit-Tests        | `[base].[suffix].test.js`             | address.validators.test.js         |
| Migrations [Init] | `[time]_init.migrations.js`           | 1748..._init.migrations.js         |
| Migrations        | `[time]_[base]-[suffix].migrations.js`| 1748..._meta-update0.migrations.js |

<br>


## 🈳 Functions

| Description             | Prefix                | Example                       |
|-------------------------|-----------------------|-------------------------------|
| Calculate data          | `calc`                | calcDrivingAirport()          |
| Get data                | `get`                 | getPlaceDetails()             |
| Check status            | `is`, `has`, `can`    | hasParams()                   |
| Configure data          | `format`, `transform` | transformOptions()            |
| Validate data           | `validate`            | validateImageSize()           |
| Initiate data/process   | `init`                | initRouteCollection()         |
| Convert data            | `map`, `to`           | toPayload(), mapRoutes()      |

<br>

## Testing

| Description                   | Prefix                          | Example                       |
|-------------------------------|---------------------------------|-------------------------------|
| Basic mocks fn/results        | `mock`                          | mockResult, mockAPI           |
| Mock specific params          | `mockParam_`                    | mockParam_language            |
| Mock specific values          | `[cause]_[entity]_test_[value]` | invalid_clients_test_id       |
| Testcontainer data testing    | `test`                          | testParam_, testResult        |
| Basic data to test from json  | `MockData_`                     | MockData_places               |
| Integration-Tests             | --                              | workflow/express-validation   |
| Unit-Tests                    | --                              | models, custom validation     |
| Description: parameters       | `Params: \<name\>`              | <origin>, <subject>           |
| Description: triggered result | `by [name]`                     | notEmpty by undefined         | 
<br>

## Git administration

| Description                   | Prefix                       | Example                      |
|-------------------------------|------------------------------|------------------------------|
| Feature branch                | SUPPORT-[JiraRefNr]-[Desc]   | SUPPORT-8-db-setup           |
| Merge commit [not-Master]     | by[Branch]-[Desc?]_[Version] | byDevelopment-Hotfix_vX.Y.Z  |
| Merge commit [Master]         | toMaster-[Desc?]_[Version]   | toMaster_v1.6.3              |

## 🈺 Other

| Classification            | Structure                   | Example                   |
|---------------------------|-----------------------------|---------------------------|
| Enum (template access)    | `[EnumName]Enum`            | BaseRouteEnum = BaseRoute |
| Environment variables     | `SECRET_[description]`      | SECRET_API_KEY            |
| Logger context (method)   |  support_[Class]_[Method]`  | support_DBConnect_Init    |

<br>

## Abbreviations

| Abbreviation           | Definition                  | Value/Importance             |
|------------------------|-----------------------------|------------------------------|
| S_ID                   | Service Identification      | 'artdv', 'tava'              |
| Desc                   | Description                 | --                           |

