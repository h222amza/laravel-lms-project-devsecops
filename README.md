# Laravel LMS — DevSecOps Implementation

A security-focused DevSecOps implementation of an open-source Laravel Learning Management System (LMS), focusing on containerization, configuration security, automated build validation, backend testing, and preparation for deployment on AWS.

## Acknowledgement

This project uses the open-source LMS backend originally created by [Muhamet-Ali](https://github.com/Muhamet-Ali/LMSbackend).

Thank you to the original author for developing and sharing the project with the community.

This repository focuses on extending the existing application with professional DevOps, DevSecOps, containerization, CI automation, and cloud deployment practices. The original LMS application is credited to its respective author.

## Project Overview

The objective of this project is to implement a secure, automated, and maintainable deployment workflow for a Laravel-based LMS application with a React frontend and MySQL database.

The implementation focuses on:

- Containerizing the frontend, backend, and database services.
- Managing environment-specific configuration outside source control.
- Establishing automated frontend build and backend test validation through GitHub Actions.
- Configuring Nginx for frontend delivery and backend API routing.
- Preparing the application for security scanning and controlled AWS deployment.
- Building a foundation for future deployment to Amazon ECS on EC2 using Amazon ECR.

## Technology Stack

- Frontend: React
- Backend: Laravel 12
- Backend runtime: PHP 8.3 and PHP-FPM
- Web server: Nginx
- Database: MySQL 8.4
- Containerization: Docker
- Local orchestration: Docker Compose
- CI/CD foundation: GitHub Actions
- Backend testing: Laravel PHPUnit/Pest test tooling
- Planned security tools: Gitleaks, Composer Audit, npm audit, SAST, and Trivy
- Planned cloud platform: AWS ECS on EC2, Amazon ECR, and GitHub Actions with AWS OIDC

## Architecture

The current local containerized architecture is organized as follows:

Browser
  |
  v
Frontend Container
React Production Build + Nginx
  |
  |-- /api requests
  |-- Configured upload and media paths
  |
  v
Backend Container
Nginx + PHP-FPM + Laravel
  |
  v
MySQL 8.4 Container

Docker Compose provides service networking and persistent volumes for database data and required application files.

The frontend is exposed locally on port 3000. The backend listens on port 8080 within the Compose network, while MySQL uses its internal container port 3306.

These settings describe the local deployment environment. Production AWS infrastructure and automated deployment have not yet been implemented.

## Implemented Changes

### 1. Docker Containerization

- Added a root-level `docker-compose.yml` to coordinate the frontend, backend, and MySQL services.
- Updated the backend Dockerfile to use PHP 8.3 FPM, Nginx, and Supervisor.
- Configured the backend Nginx server to listen on port 8080 and forward PHP requests to PHP-FPM.
- Added PHP production configuration for upload limits.
- Configured persistent volumes for database data and required backend storage and upload files.
- Used a dedicated Docker Compose network for communication between services.

The objective is to make local deployment repeatable and provide a consistent foundation for cloud deployment.

### 2. Frontend API Routing

- Replaced hardcoded localhost API references with relative `/api` paths or relative backend URLs where appropriate.
- Configured frontend Nginx to proxy API requests to the backend service.
- Configured Nginx handling for selected upload and media paths.
- Avoided broadly proxying application routes that need to be handled by React Router.
- Configured an upload request size limit in Nginx.

These changes reduce environment-specific hardcoding and allow the frontend to communicate through the configured Nginx entry point.

### 3. Environment Configuration and Secret Handling

- Updated `.gitignore` to exclude environment files, including `.env` and `LMSbackend/.env`.
- Verified that these environment files are ignored by Git.
- Restricted permissions on the root `.env` file in the local environment.
- Kept environment-specific configuration outside the application source code.

Security considerations:

- Environment files must not be committed to the repository.
- Credentials must not be embedded in Docker images.
- Production secrets should be supplied through an appropriate secret-management mechanism.
- If credentials have previously been committed or exposed, they must be revoked or rotated. Adding files to `.gitignore` does not remove secrets from Git history.
- Production credentials and sensitive application configuration must be managed separately from local development settings.

### 4. Database Migrations and API Validation

- Successfully executed Laravel database migrations against the local Compose database.
- Verified API responses through the frontend Nginx entry point.
- Tested the following endpoints:

  - `GET /api/courses`
  - `GET /api/categories`
  - `GET /api/settings`

The tested endpoints returned HTTP 200 responses. Empty data responses were consistent with a database that did not yet contain LMS records.

The existing Laravel test suite was also executed locally. The current suite is limited, so additional tests are needed to validate important application workflows.

### 5. GitHub Actions Continuous Integration

Added the workflow:

`.github/workflows/ci.yml`

The workflow contains two independent jobs.

#### Frontend Production Build

- Runs on a GitHub-hosted Ubuntu runner.
- Uses Node.js 20.
- Installs dependencies with `npm ci`.
- Uses `LMS-frontend/package-lock.json` for lockfile-based dependency installation.
- Runs the React production build.

This job checks whether the frontend can be compiled into production assets.

#### Backend Laravel Tests

- Runs on a GitHub-hosted Ubuntu runner.
- Uses PHP 8.3.
- Installs Composer dependencies.
- Creates a CI-only environment configuration and application key.
- Prepares an SQLite test database.
- Executes `php artisan test`.

This job checks whether the existing automated backend tests pass in a separate CI environment.

#### Workflow Triggers

The workflow runs on:

- Pushes to the `main` branch.
- Pull requests targeting the `main` branch.

The workflow uses:

`permissions: contents: read`

This limits the default workflow token permissions to read-only access to repository contents.

#### CI Warning Enforcement

During frontend build troubleshooting, `CI=false npm run build` was used to allow the build to complete while ESLint warnings were being addressed.

This setting bypasses Create React App's behavior of treating warnings as build failures in CI. It does not fix the warnings or provide additional security.

The intended final configuration is to fix the warnings and restore:

`npm run build`

without `CI=false`, so the pipeline can enforce stricter frontend quality checks.

### 6. Local Application Validation

The following checks have been performed:

- Docker Compose stack started successfully.
- MySQL became healthy.
- Laravel migrations completed successfully.
- Selected API endpoints returned HTTP 200 responses.
- The existing Laravel tests passed locally.
- The React production build completed after correcting a syntax error.

A successful local build does not by itself prove that all application functionality works or that the system is production-ready.

## Current Security Status

The following controls describe the implementation status accurately.

### Implemented

- Environment files excluded from Git through `.gitignore`.
- Read-only default repository permission for the GitHub Actions workflow token.
- Lockfile-based frontend dependency installation using `npm ci`.
- Automated frontend production build in CI.
- Automated backend tests in CI.
- Containerized application services.
- Nginx-based API routing and upload request-size configuration.
- Local database migrations and basic API validation.

### Planned

- Gitleaks secret detection.
- Composer dependency vulnerability auditing.
- npm dependency vulnerability auditing.
- Static Application Security Testing (SAST).
- Trivy container image vulnerability scanning.
- Automated Docker image publishing to Amazon ECR.
- GitHub Actions authentication to AWS through OpenID Connect (OIDC).
- Automated deployment to Amazon ECS on EC2.
- Staging and production deployment environments.
- Production approval gates and deployment rollback handling.
- Expanded application tests and production monitoring.

These security checks and deployment controls must be added and validated before they can be considered implemented.

## Local Setup

### Requirements

- Docker Engine
- Docker Compose v2

### Start the Application

From the repository root:

```bash
docker compose config
docker compose up -d --build
docker compose ps
```

### Inspect Logs

```bash
docker compose logs --tail=100
docker compose logs --tail=100 backend
docker compose logs --tail=100 frontend
```

### Run Database Migrations

```bash
docker compose exec backend php artisan migrate --force
```

### Access the Frontend

Open:

`http://localhost:3000`

Ensure that the required environment configuration and Laravel `APP_KEY` are correctly configured before starting the application.

Never commit `.env` files or expose credentials in logs, documentation, issues, or shared terminal output.

## Intended CI/CD Workflow

The planned release process is:

1. Develop changes in a feature branch.
2. Open a pull request.
3. Run frontend build checks, backend tests, and security checks.
4. Review changes and merge only when required checks pass.
5. Build versioned frontend and backend Docker images.
6. Scan images and publish approved images to Amazon ECR.
7. Deploy the identified release to a staging environment on Amazon ECS.
8. Run application health checks and smoke tests.
9. Promote the verified release to production, initially using an approval gate.
10. Monitor the deployment and perform rollback if the release fails configured health checks.

The ECR publishing, AWS OIDC configuration, ECS deployment, production approval, and rollback workflow are planned stages and are not part of the current CI implementation.

## Next Implementation Steps

1. Fix remaining frontend ESLint warnings and restore strict CI build enforcement.
2. Expand Laravel tests for critical LMS functionality.
3. Add Gitleaks for secret detection.
4. Add Composer and npm dependency security audits.
5. Integrate an appropriate SAST tool.
6. Add Trivy scanning for Docker images.
7. Create Amazon ECR repositories and publish identifiable image versions.
8. Configure GitHub OIDC with a narrowly scoped AWS IAM role.
9. Implement ECS deployment to staging.
10. Add post-deployment health checks, production approvals, rollback handling, logging, monitoring, backups, and recovery procedures.

## Project Disclaimer

This repository documents the DevSecOps and deployment work completed so far. The current implementation provides a foundation for automated quality checks and containerized local deployment.

A passing CI workflow, successful build, or running local Compose stack does not by itself establish that the application is secure, highly available, or production-ready. Security scanning, broader test coverage, AWS deployment, and operational validation remain part of the implementation roadmap.

