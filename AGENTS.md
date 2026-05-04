# CodexME Agent Guide

## Project Overview

CodexME is a coding challenge and playground app.

- Frontend: React, Vite, TypeScript, Tailwind CSS, Flowbite React, Monaco Editor.
- Backend: Go, Gin, MongoDB, JWT auth, Judge0 via RapidAPI.
- Local dev is usually run with `docker-compose-dev.yml`.

## Repository Layout

- `client/`: React frontend.
- `server/`: Go API backend.
- `server/api/`: Judge0 HTTP client.
- `server/controllers/`: Gin route handlers.
- `server/models/`: Shared backend data models.
- `server/services/`: Business logic, especially challenge execution/comparison.
- `nginx/`: Production nginx config.

## General Rules

- Preserve existing behavior unless intentionally refactoring.
- Do not commit secrets. The existing `.env` files are local development only.
- Prefer small, testable changes over large rewrites.
- Keep API response shapes backward compatible where possible.
- Do not add new libraries unless the standard library or existing dependencies are insufficient.

## Backend Conventions

- Run backend checks from `server/`:

```bash
go test ./...
```

- Keep route setup in `SetupRouter()` so HTTP tests can instantiate the router without binding to port `4000`.
- Do not connect to MongoDB from package `init()` functions.
- Prefer returning errors over panics. Request handling should return JSON errors and status codes.
- Controllers should stay thin: parse request, call services/repositories, return response.
- Business logic belongs in `server/services`.
- MongoDB document shapes belong in `server/models`.
- External HTTP APIs should be injectable/testable. Judge0 uses `JudgeZeroClient` for this.

## Challenge System

Challenge documents should follow the newer structured format:

- `problem_name`
- `problem_explanation`
- `difficulty`
- `function_signature`
- `starter_code`
- `example_cases`
- `inputs_outputs`
- `constraints`
- `examples` can remain as an empty array for backward compatibility.

Example `function_signature`:

```json
{
  "name": "solution",
  "parameters": [
    { "name": "s", "type": "string" }
  ],
  "return_type": "number"
}
```

Example `starter_code`:

```json
{
  "python": "def solution(s):\n    # Write your solution here\n    pass",
  "javascript": "function solution(s) {\n    // Write your solution here\n}",
  "typescript": "function solution(s: string): number {\n    // Write your solution here\n}"
}
```

Example test case:

```json
{
  "input": ["Hello World"],
  "expected_output": 5,
  "comparison": "number"
}
```

Supported challenge comparison modes:

- `trimmed`
- `exact`
- `number`
- `float_tolerance`
- `deep_equal`
- `unordered_array`

Rules:

- `function_signature.parameters.length` must match each `inputs_outputs.input.length`.
- Challenge execution currently supports Python, JavaScript, and TypeScript.
- Use `number` for numeric outputs.
- Use `deep_equal` for arrays/objects when output is valid JSON-compatible text.
- Use `unordered_array` when element order should not matter.

## Frontend Conventions

- Run frontend checks from `client/`:

```bash
npm run typecheck
```

- Non-JSX files should use `.ts`, not `.tsx`, when practical.
- Shared frontend types should live under `client/src/types/` if they are reused.
- Shared language configuration lives in `client/src/constants/languages.ts`.
- Challenge pages should fetch a challenge once and pass data into child components through props.
- Monaco editor `value` props must always be strings.

## Local Development

From the project root:

```bash
docker compose -f docker-compose-dev.yml up
```

Backend only:

```bash
docker compose -f docker-compose-dev.yml up backend
```

Frontend only:

```bash
docker compose -f docker-compose-dev.yml up frontend
```

If Vite or Docker serves stale files, restart the relevant service:

```bash
docker compose -f docker-compose-dev.yml restart frontend
docker compose -f docker-compose-dev.yml restart backend
```

## Known Improvement Areas

- Harden auth middleware so invalid tokens never crash the backend.
- Add validation for signup/login and duplicate users.
- Move MongoDB access behind repository interfaces.
- Improve Judge0 polling by parsing terminal status IDs structurally.
- Rename typo files such as `sumbitChallenge.tsx`.
- Move API files that do not contain JSX from `.tsx` to `.ts`.
