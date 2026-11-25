# Contributing

Thank you for considering a contribution. The project is split into independently installed `client/` and `server/` packages; keep changes scoped to the package(s) they affect and update the documentation when behavior or setup changes.

## Development setup

1. Install Node.js and npm, plus a PostgreSQL instance for API/database work.
2. Install client and server dependencies:

   ```sh
   cd client && npm ci
   cd ../server && npm ci
   ```

3. Copy `client/.env.example` to `client/.env.local` and `server/.env.example` to `server/.env`. Configure local API, database, Cognito, and image-origin values. Do not commit credentials or secrets.
4. In `server/`, generate the Prisma client and apply migrations:

   ```sh
   npx prisma generate
   npx prisma migrate dev
   ```

5. Optionally seed a fresh development database with `npm run seed` from `server/`. The script currently does not clear data; do not use it as a reset operation.
6. Run the server and client in separate terminals with `npm run dev` from their respective package directories.

See the root [README](README.md) and [development guide](docs/development.md) for full setup and script details.

## Branching and commits

No branching strategy or commit-message convention is established in the repository. As a suggested convention (not an existing project policy), use a short topic branch and focused commits with imperative messages. For example:

```text
feat: add project filter
fix: handle missing task dates
docs: clarify local database setup
```

## Formatting and linting

- Follow the existing TypeScript, React, and Prisma patterns in the relevant package.
- The client lint command is `cd client && npm run lint`.
- Prettier is configured in each package; the client enables Tailwind class sorting and the server enables Prisma formatting. There are no package formatting scripts. Example checks:

  ```sh
  cd client && npx prettier --check src
  cd ../server && npx prettier --check src prisma
  ```

Run formatting on the changed files if a check reports formatting differences.

## Testing expectations

There is no automated test suite configured at present. The server `npm test` script is a placeholder that exits with an error, and the client has no test script. For a change, run the applicable available checks, such as client lint/build or server build, and manually verify affected flows where practical. Do not claim an automated test passed when no test runner is configured.

If adding tests, keep them focused on observable behavior and include setup instructions for any new test tooling.

## Pull requests and review

The repository does not define a formal pull request or review policy. Recommended practices:

- Explain the problem and the behavior changed; link a related issue if one exists.
- Keep each pull request focused and call out any database migration, environment variable, or deployment impact.
- Include screenshots for material UI changes and sample requests/responses for API changes when useful.
- List the commands/checks run and any checks not run.
- Update relevant documentation and `.env.example` templates when configuration or usage changes.
- Request review from maintainers familiar with the affected package. Address review feedback before merging.

## Security and configuration

Never commit passwords, access tokens, production connection strings, or other secrets. Use package-local environment files for local work and the environment-variable mechanism of the deployment platform for deployed services. `NEXT_PUBLIC_*` values are browser-visible and are not suitable for secrets.
