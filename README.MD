# CodexME

CodexME is a coding playground and challenge platform for practicing programming problems in Python, JavaScript, and TypeScript. It includes a React/Vite frontend, a Go/Gin API, MongoDB-backed challenges, JWT cookie authentication, and Judge0-powered code execution through RapidAPI.

This repository is a rewrite of the original Python/Reflex version. The current stack is designed to be simpler to test, easier to deploy with Docker, and easier to extend as the challenge system grows.

## Features

- Online playground for Python, JavaScript, and TypeScript.
- Challenge list and individual challenge pages.
- Structured challenge examples, constraints, starter code, and function signatures.
- Multi-test challenge submissions through Judge0.
- Result comparison modes for strings, numbers, arrays, objects, and unordered arrays.
- JWT cookie authentication.
- MongoDB challenge storage.
- SEO basics for public routes.
- Docker-based local development and production deployment.

## Tech Stack

Frontend:

- React
- Vite
- TypeScript
- React Router
- Tailwind CSS
- Flowbite React
- Monaco Editor

Backend:

- Go
- Gin
- MongoDB
- JWT
- Judge0 through RapidAPI

Infrastructure:

- Docker
- nginx
- GitHub Container Registry

## Project Structure

```text
client/                 React frontend
client/src/api/         Frontend API clients
client/src/components/  Shared frontend components
client/src/pages/       Route pages
server/                 Go backend
server/api/             Judge0 API client
server/controllers/     Gin HTTP handlers
server/initializers/    Environment and database setup
server/middleware/      Auth middleware
server/models/          Backend data models
server/services/        Business logic
nginx/                  Production nginx config
docker-compose-dev.yml  Local development compose file
docker-compose.yml      Local production-style compose file
```

## Environment Variables

Create a backend environment file at `server/.env` for local development.

Recommended local backend config:

```env
RAPIDAPI_KEY=your_rapidapi_key
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/?retryWrites=true&w=majority&appName=CodexMe
JWT_SECRET=your_jwt_secret
ENVIRONMENT=development
GIN_MODE=debug
```

Production backend config:

```env
RAPIDAPI_KEY=your_rapidapi_key
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ENVIRONMENT=production
GIN_MODE=release
```

`MONGODB_URI` is preferred. The backend can also build a MongoDB URI from `DB_USERNAME` and `DB_PASSWORD`, but a full `MONGODB_URI` is less error-prone.

Do not commit real secrets.

## Local Development

Run the full app with Docker:

```bash
docker compose -f docker-compose-dev.yml up
```

Local URLs:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:4000
```

Run only the backend container:

```bash
docker compose -f docker-compose-dev.yml up backend
```

Run only the frontend container:

```bash
docker compose -f docker-compose-dev.yml up frontend
```

## Running Without Docker

Backend:

```bash
cd server
go run .
```

Frontend:

```bash
cd client
npm install
npm run dev
```

## Testing And Checks

Backend tests:

```bash
cd server
go test ./...
```

Frontend typecheck:

```bash
cd client
npm run typecheck
```

Frontend production build:

```bash
cd client
npm run build
```

Frontend lint:

```bash
cd client
npm run lint
```

## API Routes

Backend routes are registered in `server/main.go`.

```text
POST /submission
POST /batch
POST /signup
POST /login
GET  /logout
GET  /validate
GET  /challenges
GET  /challenge/:id
POST /newchallenge
POST /submitchallenge
```

In production, nginx should proxy frontend `/api/*` requests to the backend.

Example:

```text
https://codexme.net/api/challenges -> backend:4000/challenges
```

## Challenge Document Structure

Challenges are stored in MongoDB. New documents should use this shape:

```json
{
  "problem_name": "Length of Last Word",
  "problem_explanation": "Given a string s consisting of words and spaces, return the length of the last word in the string.",
  "difficulty": "easy",
  "function_signature": {
    "name": "solution",
    "parameters": [
      {
        "name": "s",
        "type": "string"
      }
    ],
    "return_type": "number"
  },
  "starter_code": {
    "python": "def solution(s):\n    # Write your solution here\n    pass",
    "javascript": "function solution(s) {\n    // Write your solution here\n}",
    "typescript": "function solution(s: string): number {\n    // Write your solution here\n}"
  },
  "example_cases": [
    {
      "input": "s = \"Hello World\"",
      "output": "5",
      "explanation": "The last word is \"World\" with length 5."
    }
  ],
  "examples": [],
  "inputs_outputs": [
    {
      "input": ["Hello World"],
      "expected_output": 5,
      "comparison": "number"
    }
  ],
  "constraints": "1 <= s.length <= 10^4"
}
```

Challenge rules:

- `function_signature.name` is the function the user must implement.
- `function_signature.parameters.length` must match every `inputs_outputs.input.length`.
- `starter_code` should include entries for `python`, `javascript`, and `typescript`.
- `example_cases` are shown in the UI.
- `inputs_outputs` are the test cases used for judging.
- Keep `examples` as an empty array for backward compatibility.

Supported comparison modes:

- `trimmed`
- `exact`
- `number`
- `float_tolerance`
- `deep_equal`
- `unordered_array`

## Deployment

For the VPS deployment, publish these GitHub Container Registry images:

```text
ghcr.io/gioak1993/nginx:latest
ghcr.io/gioak1993/backend:latest
```

Build and push the nginx/frontend image for an AMD64 server:

```bash
docker buildx build \
  --platform linux/amd64 \
  -f Dockerfile.client \
  -t ghcr.io/gioak1993/nginx:latest \
  --push .
```

Build and push the backend image for an AMD64 server:

```bash
docker buildx build \
  --platform linux/amd64 \
  -f Dockerfile.server \
  -t ghcr.io/gioak1993/backend:latest \
  --push .
```

Recommended VPS `docker-compose.yml`:

```yaml
name: codexme

services:
  backend:
    image: ghcr.io/gioak1993/backend:latest
    expose:
      - "4000"
    env_file:
      - ./server.env
    networks:
      - codex_network
    restart: unless-stopped

  nginx:
    image: ghcr.io/gioak1993/nginx:latest
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro
    networks:
      - codex_network
    restart: unless-stopped

networks:
  codex_network:
    driver: bridge
```

Deploy on the server:

```bash
docker compose pull
docker compose up -d
```

Useful production checks:

```bash
docker compose logs backend --tail=100
docker compose logs nginx --tail=100
docker compose exec nginx wget -qO- http://backend:4000/challenges
curl -i https://codexme.net/api/challenges
```

## SEO

The frontend includes:

- Global metadata in `client/index.html`.
- Per-route metadata through `client/src/components/SEO.tsx`.
- `robots.txt`.
- `sitemap.xml`.
- Open Graph metadata.
- Twitter card metadata.

This is still a client-rendered SPA, so route-specific SEO metadata is updated after JavaScript loads. If SEO becomes a major goal, the next step should be prerendering or server-side rendering.

## Development Notes

- Keep backend route setup inside `SetupRouter()` so tests can create the Gin router without starting the real server.
- Keep MongoDB connection setup out of package initialization so tests do not require a live database.
- Keep Judge0 configuration injectable so tests can use fake HTTP servers.
- Do not use `log.Fatal` or `panic` during request handling. Return proper HTTP errors instead.
- Prefer structured challenge fields over parsing display text.

## Roadmap

- Harden signup and login validation.
- Add a repository layer for MongoDB access.
- Add challenge creation and editing UI.
- Add user submission history.
- Add challenge authoring validation.
- Improve Judge0 polling with typed response parsing.
- Add CI for backend tests and frontend checks.
- Add rate limiting for code execution and challenge submission.

## Original Project

The original Python/Reflex version is available here:

```text
https://github.com/Gioak1993/CodeXme
```
