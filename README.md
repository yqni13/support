# yqni13 | support
$\texttt{\color{teal}{v0.8.2}}$


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
The project will be hosted by <a href="https://render.com/">Render</a> in a Docker container and a PostgreSQL database by Neon.<br>
The development process is structured by the TDD (test driven development) principle.

<br>

## Overview

### $\textsf{\color{teal}Features}$

<dl>
    <dd>:closed_lock_with_key: maintenance mode can en/disable application via single request</dd>
    <dd>:key: request verification by api-keys</dd>
</dl>

<br>

## Updates
[see changelog for all updates](/docs/CHANGELOG.md)

### $\textsf{\color{forestgreen}last update:}$

$\textsf{[v0.8.1\ =>\ {\textbf{\color{brown}v0.8.2}]}}$ app<br>
$\textsf{[v1.3.0\ =>\ {\textbf{\color{brown}v1.3.1}]}}$ database<br>
$\textsf{[v1.0.2\ =>\ {\textbf{\color{brown}v1.0.3}]}}$ docker
- $\textsf{\color{orange}Patch:}$ Updated timestamp handling without timezone in backend (db saves with timezone and only converts in Frontend).
- $\textsf{\color{orange}Patch:}$ Added migration to change type for timestamps of table 'users' and 'tickets'.
- $\textsf{\color{green}Change:}$ Removed timezone setting from docker due to UTC-Update.

<br>

### Update objectives:
<dl>
    <dd>- cloudflare setup</dd>
    <dd>- jenkins setup</dd>
    <dd>- host setup</dd>
    <dd>- mail setup</dd>
</dl>