# 📜 GLOSSARY 📜

Guidelines to handle common naming schemas.<br>
Consistency within these rules improve readability, maintenance and modular development.

<br>

## 🈹 Prefix (Decorators)

| Prefix    | Description                                    |
|-----------|------------------------------------------------|
| `support` | global/reusable components/directives (common) |
| `app`     | feature-specific components (modules)          |

<br>


## 🈯 File naming

Basic description: `<base>.<subsuffix?>.<suffix>.<ending>` [specific always singular]

| Classification    | Structure                             | Example                         |
|-------------------|---------------------------------------|---------------------------------|
| Controllers       | `[base].controller.[ending]`          | mailing.controller.js           |
| Loaders           | `[base].loader.[ending]`              | express.loader.js               |
| Middleware        | `[base].model.[ending]`               | error.middleware.js             |
| Validators        | `[base]Validator.middleware.[ending]` | mailingValidator.middleware.js  |
| Models            | `[base].model.[ending]`               | mailing.model.js                |
| Routes            | `[base].routes.[ending]`              | mailing.routes.js               |
| Services          | `[base].service.[ending]`             | mailing.service.js              |
| Utils             | `[base].utils.[ending]`               | common.utils.js                 |
| Mock data         | `[base].mock.json`                    | mailing.mock.json               |
| Enums             | `[base].enum.[ending]`                | snackbar-options.enum.js        |
| Integration-Tests | `[base].integration.test.js`          | mailing.integration.test.js     |
| Unit-Tests        | `[base].[suffix].test.js`             | address.validators.test.s       |

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

| Description                   | Prefix              | Example                       |
|-------------------------------|---------------------|-------------------------------|
| Basic mocks fn/results        | `mock`              | mockResult, mockAPI           |
| Mock specific params          | `mockParam_`        | mockParam_language            |
| DB mock specific actions      | `mockDB_`           | mockDB_init                   |
| Basic data to test from json  | `MockData_`         | MockData_places               |
| Integration-Tests             | --                  | workflow/express-validation   |
| Unit-Tests                    | --                  | models, custom validation     |
| Description: parameters       | `Params: \<name\>`  | <origin>, <subject>           |
| Description: triggered result | `by [name]`         | notEmpty by undefined         | 

<br>

## 🈺 Other

| Classification            | Structure                   | Example                   |
|---------------------------|-----------------------------|---------------------------|
| Enum (template access)    | `[EnumName]Enum`            | BaseRouteEnum = BaseRoute |
| Environment variables     | `SECRET_[description]`      | SECRET_API_KEY            |
| Logger context (method)   | `tava_[Class]_[Method]`     | tava_DBConnect_Init       |

<br>

## Abbreviations

| Abbreviation           | Definition                  | Value/Importance             |
|------------------------|-----------------------------|------------------------------|
| S_ID                   | Service Identification      | 'artdv', 'tava'              |

