# Security Policy

## Supported versions

Security fixes are provided for the latest published version. Before the first npm release, use the latest reviewed commit from the default branch.

## Reporting a vulnerability

Please do not report exploitable vulnerabilities in a public issue. Use GitHub's private vulnerability reporting feature for this repository. Include:

- A clear description of the affected behavior
- A minimal reproduction using synthetic text only
- The impact you believe an attacker or user could cause
- Any suggested mitigation

Please do not include private library records, personal information, credentials, or production data in a report.

## Security scope

Arabic Search Kit is a local string-processing utility. It does not make network requests, access files, or store user input. Applications integrating it remain responsible for access control, data handling, and safe rendering of search results.
