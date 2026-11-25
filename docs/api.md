# API Reference

## Base URL and conventions

The API is an Express application listening on `PORT`, defaulting to `3001`. Endpoints have no `/api` prefix. For local development, the base URL is typically `http://localhost:3001`.

Requests and responses use JSON except for the root endpoint. `express.json()` and URL-encoded body parsing are enabled. The API does not define a version prefix, OpenAPI specification, authentication middleware, or centralized request validation.

The client adds a Cognito access token as a bearer `Authorization` header when one is available. The server currently does not verify or authorize that token; all routes are reachable without it.

## Endpoints

### Health/root response

| Method and path | Behavior |
| --- | --- |
| `GET /` | Returns the plain-text response `This is home route`. This is not a structured health check. |

### Projects

| Method and path | Behavior |
| --- | --- |
| `GET /projects` | Returns all project rows. |
| `POST /projects` | Creates a project. |

`POST /projects` body:

```json
{
  "name": "Website refresh",
  "description": "Optional project description",
  "startDate": "2026-01-15T00:00:00.000Z",
  "endDate": "2026-06-30T00:00:00.000Z"
}
```

`name` is required by the database. `description`, `startDate`, and `endDate` are optional. A successful create returns HTTP `201`.

### Tasks

| Method and path | Behavior |
| --- | --- |
| `GET /tasks/project/:id` | Returns tasks for the positive integer project ID, including each task's `author`, `assignee`, `comments`, and `attachments`. |
| `POST /tasks` | Creates a task row. |
| `PATCH /tasks/:id/status` | Updates the task's `status` field. |
| `GET /tasks/user/:id` | Returns tasks whose author or assignee is the positive integer user ID; includes `author` and `assignee`. |

`POST /tasks` body fields:

| Field | Database requirement | Notes |
| --- | --- | --- |
| `title` | Required | Task title. |
| `status` | Required | String; the API does not validate allowed values. |
| `priority` | Required | String; the API does not validate allowed values. |
| `projectId` | Required | Existing project ID. |
| `authorUserId` | Required | Existing author user ID. |
| `description` | Optional | Nullable string. |
| `tags` | Optional | Nullable string; UI treats it as comma-separated text. |
| `startDate` | Optional | Nullable date/time value accepted by Prisma. |
| `dueDate` | Optional | Nullable date/time value accepted by Prisma. |
| `points` | Optional | Nullable integer. |
| `assignedUserId` | Optional | Nullable ID of an existing user. |

`PATCH /tasks/:id/status` body:

```json
{ "status": "Work In Progress" }
```

The handler validates that `:id` is a positive integer. It does not validate the status value or validate the request body before passing it to Prisma.

### Search

| Method and path | Behavior |
| --- | --- |
| `GET /search?query=<text>` | Searches tasks, projects, and users concurrently. Each entity query is limited to 10 results. |

The query must be a non-empty string after trimming; otherwise the API returns HTTP `400`. Search is case-insensitive and matches task title/description, project name/description, and username. The user search selects only `id`, `username`, and `profilePictureUrl`; tasks and projects are returned without included relations.

Example:

```http
GET /search?query=website
```

### Users

| Method and path | Behavior |
| --- | --- |
| `GET /users` | Returns all user rows. |
| `POST /users` | Creates a user row. |
| `GET /users/cognitoId/:id` | Looks up a user by Cognito subject (`cognitoId`). |

`POST /users` accepts `username` and `cognitoId` (required by the database), with optional `profilePictureUrl` and `teamId`. The handler defaults `profilePictureUrl` to `"i1.jpg"` and `teamId` to `1` when those properties are omitted. A successful create returns HTTP `201`.

The Cognito lookup returns HTTP `404` and `{"message":"User not found"}` when no matching application record exists. The client uses this endpoint to load the signed-in user's application profile. Sign-up does not automatically call the user-creation endpoint.

### Teams

| Method and path | Behavior |
| --- | --- |
| `GET /teams` | Returns all teams and selected product-owner/project-manager fields (`username`, `profilePictureUrl`). |

No team create, update, or delete route is currently defined.

## Response shapes

Successful collection and lookup handlers use:

```json
{
  "success": true,
  "data": []
}
```

Mutation handlers use the same envelope with the created or updated record in `data`; user creation also includes `"message":"User Created Successfully"`. The root endpoint is plain text and does not use this envelope.

The exact fields under `data` vary by endpoint:

- Project and user queries return Prisma model fields.
- Project-task queries include author, assignee, comments, and attachments.
- User-task queries include author and assignee.
- Team queries include `teamProductOwner` and `teamProjectManager`, each either `null` or an object containing `username` and `profilePictureUrl`.
- Search returns `{ "tasks": [], "projects": [], "users": [] }` nested under `data`.
- Create and status-update mutations return the raw Prisma record without included relations.

## Errors and validation

| Condition | Status | Response behavior |
| --- | --- | --- |
| Invalid task project/user path ID | `400` | JSON `message` identifies the invalid ID. |
| Missing or blank search query | `400` | `{"message":"A valid search query is required."}` |
| Cognito ID has no database user | `404` | `{"message":"User not found"}` |
| Database or handler exception | `500` | JSON `message` includes an operation-specific prefix and the caught error message. |

There is no shared error envelope for all responses. Create handlers and task status update do not perform explicit field validation; database constraint errors are surfaced as HTTP `500`, not a client validation status. The server's error response may include internal database error details and should be reviewed before production exposure.
