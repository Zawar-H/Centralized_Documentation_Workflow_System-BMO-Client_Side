# BMO Centralized Intake System

Client-side project intake and documentation review portal for PMO-style governance workflows.

## Overview

This demo application simulates a structured intake and review process for project documentation. It supports project tracking, artifact submission and remediation, and role-based oversight for PMO and delivery stakeholders.

## Key Features

- Mock login and role switching
- Centralized project dashboard with search, filters, and project actions
- Guided artifact editor with comments, uploads, and status tracking
- Round-based review workflow with remediation support
- Read-only leadership view for oversight and artifact history
- Fully client-side demo with no backend storage

## Project Structure

- index.html - application shell and page layout
- css/styles.css - custom styling
- js/ - application logic for state, dashboard, editor, review, and role-based views
- logo.svg - project branding asset

## Running Locally

Open index.html directly in a browser, or serve the folder with any simple local web server.

```
python -m http.server 8000
```

## Notes

- Demo only; no production backend is connected.
- Session data remains in the browser while the page is open.
