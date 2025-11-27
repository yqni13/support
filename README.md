# yqni13 | support
$\texttt{\color{teal}{v0.9.4}}$


<br>

<div>
    <img src="assets/img/readme-bg.png" alt="logo">
</div>

### Technology

<div style="display:flex; align-items:center;">
    <img src="assets/icons/nodejs.png" alt="NodeJS">
    <img src="assets/icons/express.png" alt="Express">
    <img src="assets/icons/jest.png" alt="Jest">
    <img src="assets/icons/neon.png" alt="Neon">
</div>
<div style="display:flex; align-items:center;">
    <img src="assets/icons/docker.png" alt="Docker">
    <img src="assets/icons/jenkins.png" alt="Jenkins">
    <img src="assets/icons/postgresql.png" alt="PostgreSQL">
</div>
<div style="display:flex; align-items:center;">
    <img src="assets/icons/cloudflare.png" alt="Cloudflare">
    <img src="assets/icons/betterstack.png" alt="Betterstack">
    <img src="assets/icons/testcontainers.png" alt="Testcontainers">
</div>

<br>

## How to

### Build & Deploy
This application server will be hosted by <a href="https://render.com/">Render</a> in a Docker container and a PostgreSQL database by Neon.<br>
The development process is structured by the TDD (test driven development) principle.

<br>

## Overview

### $\textsf{\color{teal}Features}$

<dl>
    <dd>🪲 support/bug-ticket handling including client + user data</dd>
    <dd>:closed_lock_with_key: maintenance mode can en/disable application via single request</dd>
    <dd>:key: request verification by api-keys</dd>
</dl>

<br>

### $\textsf{\color{teal}Logging}$

To monitor errors the logging framework `Winston` is used in combination with Logtail from `Betterstack` as a Singleton: [config](./backend/src/logger/config.logger.ts)
<br>While working within local (DEV) or test environment, error messages are logged into the consoles. For the deployed environments (STAG/PROD) the logging is set to send logtails to Betterstack (longer storage time than app-hosting service). For easy access and monitoring of error messages, the Betterstack UI client dashboard comes in handy (see Figure 1). 
<div align="center">
    <img src="assets/img/betterstack_logging.png" alt="&nbsp;Betterstack logging dashboard">
    Figure 1 - Betterstack logging dashboard, v0.9.4
</div>

<br>

## Testing

### $\textsf{\color{teal}Jest}$

Added `jest` testing framework to project providing unit tests and integration tests for the `backend`.<br>
Install the packages `@jest/globals`, `@types/jest`, `supertest`, `@testcontainers/postgresql` and `testcontainers` additional to `jest`:
```sh
npm install jest @jest/globals @types/jest supertest @testcontainers/postgresql testcontainers --save-dev
```
190 tests exist currently for models, utils, validators and workflows (integration tests) - see [tests](./backend/tests).<br>
Run tests on local device by including setup for dotenv/config to provide environment variables:
```sh
set NODE_ENV=test && jest --setupFiles dotenv/config
```
or simply save as script command in `package.json` to run `npm test`:
```sh
"scripts": {
    "start:dev": "ts-node --files src/server.ts",
    "test": "set NODE_ENV=test && jest --setupFiles dotenv/config"
}
```
To automatically check tests before merging feature/development branch further up, a `GitHub Action` is set up, see [main.yml](.github/workflows/main.yml).<br>
Preventing an unwanted merge with unfinished/failed test run, the project is set up to disable merging until all tests have passed (see Figure 2 to Figure 3).

<div align="center">
    <img src="assets/img/github-action-jest-processing.png" alt="&nbsp;GitHub processing tests">
    Figure 2 - processing tests, v0.9.1
</div>
<br>
<div align="center">
    <img src="assets/img/github-action-jest-passed.png" alt="&nbsp;GitHub tests passed">
    Figure 3 - passing tests, v0.9.1
</div>

<br>

## Updates
[see changelog for all updates](/docs/CHANGELOG.md)

### $\textsf{\color{forestgreen}last update:}$

$\textsf{[v0.9.3\ =>\ {\textbf{\color{brown}v0.9.4}]}}$ app
- $\textsf{\color{orange}Patch:}$ Refactored and integrated logger on necessary hotspots (catch-blocks).

<br>

### Update objectives:
<dl>
    <dd>- cloudflare setup</dd>
    <dd>- jenkins setup</dd>
    <dd>- host setup</dd>
    <dd>- mail setup</dd>
</dl>