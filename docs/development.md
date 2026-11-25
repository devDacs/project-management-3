# Development Guide

## Package layout

The client and API are separate npm packages, each with its own `package.json`, lockfile, TypeScript configuration, and local dependencies.

```text
client/
  src/app/          Next.js pages, layout, and project-specific views
  src/components/   Shared React UI
  src/state/        Redux store, persisted preferences, RTK Query API
  src/lib/          Client utilities
  public/           Static image and icon assets
server/
  src/index.ts      Express application setup and listen call
  src/routes/       URL-to-controller mappings
  src/controllers/  Endpoint handlers and Prisma queries
  src/lib/prisma.ts PostgreSQL adapter and Prisma client
  prisma/           Schema, migrations, sample data, seed script
```

## Local setup

Install dependencies independently:

```sh
cd client && npm ci
cd ../server && npm ci
```

Create `client/.env.local` from `client/.env.example` and `server/.env` from `server/.env.example`; configure the required service values. From `server/`, generate the Prisma client and apply migrations:

```sh
npx prisma generate
npx prisma migrate dev
```

Optionally run `npm run seed` in `server/` only against a fresh database. The script's cleanup implementation is empty and it is not safe to treat it as a reset command.

Start each package in its own terminal:

```sh
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

The API defaults to port `3001`; Next.js development uses its standard port `3000`. Set the client API base URL to the API origin. Setup dependencies, environment variables, and known gaps are also summarized in the root [README](../README.md).

## Available scripts

### Client (`client/`)

| Script | Command | Behavior |
| --- | --- | --- |
| `npm run dev` | `next dev` | Starts the Next.js development server. |
| `npm run build` | `next build` | Creates a production Next.js build. |
| `npm run start` | `next start` | Serves a previously built Next.js application. |
| `npm run lint` | `next lint` | Runs the Next.js ESLint checks. |

There is no client test script.

### Server (`server/`)

| Script | Command | Behavior |
| --- | --- | --- |
| `npm run dev` | build, then `concurrently "tsc -w" "tsx watch src/index.ts"` | Builds once, then starts TypeScript watch and API watch processes. |
| `npm run build` | clean `dist`, then `tsc` | Compiles server TypeScript into `dist/`. |
| `npm start` | build, then `node dist/src/index.js` | Builds and launches the compiled API. |
| `npm run clean` | `rimraf dist` | Removes the compiled output directory. |
| `npm run seed` | `tsx prisma/seed.ts` | Inserts fixture data; it does not clear the database. |
| `npm test` | Placeholder command | Always prints that no test is specified and exits with an error. |

Run Prisma CLI commands from `server/` so `prisma7.config.ts` and the package's dependencies are in scope.

## Build and production execution

Build the client and API separately:

```sh
cd client && npm run build
cd ../server && npm run build
```

After a successful client build, `npm run start` in `client/` serves it. `npm start` in `server/` rebuilds and runs `dist/src/index.js`. These scripts do not configure hosting, HTTPS termination, production CORS, database operations, or a production process manager.

`server/ecosystem.config.cjs` runs `npm run dev` and sets `NODE_ENV=development`; it is not a production deployment configuration.

## Code style and checks

- Both packages use TypeScript. The client uses strict TypeScript and the Next.js ESLint configuration.
- Prettier is installed in each package. The client config enables `prettier-plugin-tailwindcss`; the server config enables `prettier-plugin-prisma`.
- No formatting script is defined. Run Prettier from the relevant package when desired, for example:

  ```sh
  cd client && npx prettier --check src
  cd ../server && npx prettier --check src prisma
  ```

- The client lint script is `npm run lint` in `client/`.
- No automated tests are configured. Do not interpret `npm test` in `server/` as a passing test command; it intentionally exits non-zero.

No CI workflow, enforced branch policy, or commit-message convention is present in the tracked repository. Suggested contribution practices are in [CONTRIBUTING.md](../CONTRIBUTING.md).

## Configuration and integrations

The API uses `DATABASE_URL` and optional `PORT`. The client uses `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_IMAGE_BASE_URL`, `NEXT_PUBLIC_COGNITO_USER_POOL_ID`, and `NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID`. The `NEXT_PUBLIC_` prefix makes client values available in browser code; they must not contain secrets. Full purposes and examples are in the root [README](../README.md) and the two `.env.example` files.

The client sends Cognito access tokens, but the API does not validate them. The current UI also expects a matching application user record for a Cognito subject. See [api.md](api.md) for endpoint behavior.

## Data workflow

The Prisma schema and checked-in migrations define database structure. Use `npx prisma migrate dev` to create/apply local development migrations and `npx prisma migrate deploy` to apply committed migrations in a deployment environment. Generate the client using `npx prisma generate`. The repository does not set up a separate seeding lifecycle; the `npm run seed` command runs the standalone fixture script.
