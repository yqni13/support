# yqni13 support

### $\texttt{\color{olive}{LIST\ OF\ UPDATES}}$

<br>

### $\textsf{\color{skyblue}2025/11/11}$

$\textsf{[v0.7.1\ => {\textbf{\color{brown}0.7.3}]}}$ app<br>
$\textsf{[v1.0.1\ => {\textbf{\color{brown}1.0.2}]}}$ docker<br>
- $\textsf{\color{teal}Addition:}$ Added script to run tests on GitHub PR's (feat* => DEV, DEV => STAG, STAG => PROD).
- $\textsf{\color{orange}Patch:}$ Updated tests for existing timestamps to convert by UTC.
- $\textsf{\color{orange}Patch:}$ Updated docker-compose with additional env var (set timezone to temporarily fix testing in other environments).

<br>

### $\textsf{\color{skyblue}2025/11/10}$

$\textsf{[v0.7.0\ =>\ 0.7.1]}$ app<br>
- $\textsf{\color{orange}Patch:}$ Updated admin authentication by key from header.

<br>

### $\textsf{\color{skyblue}2025/11/09}$

$\textsf{[v0.5.1\ =>\ 0.7.0]}$ app<br>
$\textsf{[v1.0.1\ =>\ {\textbf{\color{brown}1.1.0}]}}$ database
- $\textsf{\color{teal}Addition:}$ Added verification middleware to validate requests by api-keys.
- $\textsf{\color{teal}Addition:}$ Migrated clients table to database and added logic to handle status changes and api-key verifications.

<br>

### $\textsf{\color{skyblue}2025/11/06}$

$\textsf{[v0.5.0\ =>\ 0.5.1]}$ app<br>
$\textsf{[v1.0.0\ =>\ 1.0.1]}$ docker
- $\textsf{\color{orange}Patch:}$ Updated secret variables to simplify settings on STAG/PROD environments.

<br>

### $\textsf{\color{skyblue}2025/11/05}$

$\textsf{[v0.4.0\ =>\ 0.5.0]}$ app<br>
$\textsf{[v0.0.0\ =>\ 1.0.0]}$ docker
- $\textsf{\color{teal}Addition:}$ Added Docker configuration to run application in container (local only at the moment).

<br>

### $\textsf{\color{skyblue}2025/11/03}$

$\textsf{[v0.3.1\ =>\ 0.4.0]}$ app<br>
$\textsf{[v1.0.0\ =>\ 1.0.1]}$ database
- $\textsf{\color{teal}Addition:}$ Added maintenance middleware and modified database + logic to handle maintenance status via request (instead of env variables).

<br>

### $\textsf{\color{skyblue}2025/10/26}$

$\textsf{[v0.3.0\ =>\ 0.3.1]}$ app
- $\textsf{\color{orange}Patch:}$ Updated timestamp handling to incorporate timezone offsets.

<br>

### $\textsf{\color{skyblue}2025/10/22}$

$\textsf{[v0.2.2\ =>\ 0.3.0]}$ app
- $\textsf{\color{teal}Addition:}$ Added new test setup including now ephemeral databases via testcontainer.

<br>

### $\textsf{\color{skyblue}2025/10/04}$

$\textsf{[v0.2.1\ =>\ 0.2.2]}$ app
- $\textsf{\color{teal}Addition:}$ Added authentication middleware (to check validity by api key).

<br>

### $\textsf{\color{skyblue}2025/10/02}$

$\textsf{[v0.1.0\ =>\ 0.2.1]}$ app<br>
$\textsf{[v0.0.0\ =>\ 1.0.0]}$ database
- $\textsf{\color{orange}Patch:}$ Updated typescript configuration to include jest testing-framework.
- $\textsf{\color{teal}Addition:}$ Added meta handling in addition to full db setup.

<br>

### $\textsf{\color{skyblue}2025/09/26}$

$\textsf{[v0.1.0\ =>\ 0.1.1]}$ app
- $\textsf{\color{teal}Addition:}$ Added basic meta route.
- $\textsf{\color{green}Change:}$ Switched from NodeJS by Javascript to Typescript.
- $\textsf{\color{green}Change:}$ Adjusted migration documentation for correct terminal commands.

<br>

### $\textsf{\color{skyblue}2025/08/02}$

$\textsf{[v0.0.0\ =>\ 0.0.1]}$ app
- $\textsf{\color{teal}Addition:}$ Added basic documentation.