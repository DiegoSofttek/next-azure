# Overview

Monorepo with **pnpm + Turborepo**. Combines a **Next.js** front end, **Azure Functions** for HTTP APIs and background work, **SQL Server** (via Drizzle in `@workspace/db`), and **Azure Blob Storage** for files.

---

## Authentication

This section is the single source of truth for all authentication in this monorepo. Every integration between the web app, Azure Functions, and the database goes through these mechanisms.

### End-user authentication (browser → Next.js)

Handles who is logged into the web application.

- **Today:** development-only **Credentials** provider via NextAuth; no real IdP yet.
- **Config:** `apps/web/auth.ts` — NextAuth config, JWT session strategy, `User` / `AuthTokenPayload` written into the session.
- **Login UI:** `apps/web/app/login/_components/login-form.tsx` — calls `signIn("credentials", …)`.
- **Types:** `apps/web/types/next-auth.d.ts` — TypeScript shape of `session.user` / JWT.
- **Route access:** `apps/web/proxy.ts` — redirects unauthenticated users to `/login`, keeps authenticated users off `/login`, and supports **role-based route rules**.

Reading the session:

- **Client Components:** use `useUser` from `apps/web/hooks/use-user.ts`.
- **Server Components / Route Handlers:** use `auth()` from `@/auth`.

### Machine-to-machine authentication (Next.js → Azure Functions)

Handles trust between the Next.js **server** and Azure Functions. This is **not** the browser session cookie and must **never** be minted or sent from the browser.

The browser never calls Azure Functions directly. Route Handlers validate the human session, then forward requests to Functions using a **short-lived internal JWT** so Functions can trust the caller without depending on the IdP token format.

**Happy path flow:**

```
Browser → Next.js Route Handler → Azure Function → @workspace/db
```

1. User is authenticated (NextAuth session exists).
2. Route Handler calls `auth()` to get `session.user`.
3. Route Handler calls `requireFunctionsAuth` (`apps/web/lib/http/require-functions-auth.ts`), which validates the session and uses `createFunctionsAccessToken` to mint a JWT with minimal claims (`sub`, `email`, `role`) signed with **`FUNCTIONS_AUTH_SECRET`** (different from `WEB_AUTH_SECRET`).
4. Route Handler calls the Function using `functionsFetch` (`apps/web/lib/http/functions-client.ts`), which attaches the internal JWT automatically.
5. The Function verifies the JWT using `requireAuthClaims` (`apps/functions/src/lib/auth/require-auth-claims.ts`) before doing any work.
6. The Function uses the validated claims for role/permission checks, then calls `@workspace/db`.

**Key files:**

| Responsibility                         | File                                                 |
| -------------------------------------- | ---------------------------------------------------- |
| Validate session + mint internal token | `apps/web/lib/http/require-functions-auth.ts`        |
| Call Functions (attaches auth header)  | `apps/web/lib/http/functions-client.ts`              |
| Validate internal token in Functions   | `apps/functions/src/lib/auth/require-auth-claims.ts` |
| Shared contracts                       | `packages/shared/src/contracts`                      |

**Every Route Handler must follow this pattern:**

```ts
// Validate user authentication and generate a JWT for the Functions
const authResult = await requireFunctionsAuth()
if (authResult.ok === false) return authResult.errorResponse

// Call the Function with generated JWT
const data = await functionsFetch<MyResponse>(MY_ROUTE, {
  authToken: authResult.authToken,
  method: "POST",
  json: payload,
})
```

**Azure Function pattern:**

```ts
// Validate JWT sent by client
  const authResult = await requireAuthClaims(request)
  if (authResult.ok === false) return authResult.errorResponse

// Use claims for permission checks if needed
  const { claims } = authResult
```

### Extending authentication

- **New route rules for end-users:** update `apps/web/proxy.ts`.
- **New Function endpoint:** define the contract in `packages/shared/src/contracts`, call it from a Route Handler using `requireFunctionsAuth` + `functionsFetch`, and validate it in the Function using `requireAuthClaims`.

---

## Web Application (`apps/web`)

### TanStack Query

- Use TanStack Query for asynchronous data fetching in Client Components.
- Keep network calls behind Next.js Route Handlers; Query should only consume app endpoints, never external services directly.

### shadcn/ui

- Shared UI components live in `packages/ui` (the `shadcn/ui` package).
- All `shadcn/ui` components are preinstalled.
- Import from `apps/web` using `@workspace/ui/components/[component]`.

### Form Validation

- Validation is mandatory in every form — never create a form without schema-based validation.
- Standard stack: `react-hook-form` + `zod` + `@hookform/resolvers/zod`.
- Show per-field validation feedback in the UI and block submission on invalid state.
- Reference implementation: `apps/web/app/reference/_components/form-example.tsx`.

---

## Azure Functions (`apps/functions`)

> Before creating or modifying any Function, read `apps/functions/README.md` first.

### Contracts

Define each Function's request/response types and route constant in `packages/shared/src/contracts` before implementing the handler.

### Handler structure

Every Function handler must follow this order:

1. **Validate internal auth**
2. **Validate input** (parse and type-check the request body/params).
3. **Call repository** methods from `@workspace/db`.
4. **Map and return** the response.

### Organization by domain

Group Functions by domain, not by single endpoint files. Prefer one HTTP Function that routes by method/path for a domain when it stays readable:

```
GET    /members
GET    /members/:id
POST   /members
PATCH  /members/:id
```

---

## Database (`packages/db`)

`packages/db` is the **only** data-access layer — it owns the schema and all repository methods. Nothing outside this package should interact with SQL Server or Azure Blob Storage directly.

### Schema and repositories

- Define or update tables in `packages/db/src/schemas/index.ts`.
- Create domain-specific repository methods in `packages/db/src/repositories/*` (e.g., `listMembers`, `getMemberById`, `createMember`, `updateMember`).
- Export everything from `packages/db/src/index.ts` so Functions can import from `@workspace/db`.

### Contracts vs. DB models

- `packages/shared` types are **transport contracts** — request/response payloads used between web and Functions.
- `packages/db` types are **persistence contracts** — table columns and repository inputs/outputs.
- Map between layers inside Functions; never expose DB internals directly in API responses.

### Checklist for adding new DB features

1. Add/update schema in `packages/db/src/schemas/index.ts`.
2. Add/update repository methods in `packages/db/src/repositories/*`.
3. Export new methods from `packages/db/src/index.ts`.
4. Add/update transport contracts in `packages/shared`.
5. Implement/update the Function handler.
6. Implement/update the Next.js Route Handler.
7. Update UI/client code to call only Next.js app endpoints.

---

## Storage

Storage access is centralized in `packages/db` and follows the same layered flow as database access.

### Key files

- **Container names:** `packages/db/src/storage/containers.ts` — define all containers here; never hardcode container strings elsewhere.
- **Blob client:** `packages/db/src/storage/client.ts` — connection string + singleton client.
- **File operations:** `packages/db/src/repositories/files.ts` — upload, signed URL generation, delete. Export new methods from `packages/db/src/index.ts`.

### Checklist for adding new storage capabilities

1. Add/update transport contracts in `packages/shared`.
2. Add container constants (if needed) in `packages/db/src/storage/containers.ts`.
3. Implement repository method(s) in `packages/db/src/repositories/files.ts` and export from `packages/db/src/index.ts`.
4. Implement/update the Function handler.
5. Implement/update the Next.js Route Handler.
6. Call only Next.js app endpoints from the UI.

---

## Testing

Run `pnpm test` from the repo root to execute all test tasks configured in Turbo.

- **Scope:** `apps/web` and `apps/functions`.
- **Runner:** Vitest, configured and ready in both apps.
  - `apps/web/vitest.config.mts` — UI/client tests with `jsdom`.
  - `apps/functions/vitest.config.mts` — server/function tests with `node`.
- **Convention:** co-locate tests with their source file using `*.test.ts` or `*.test.tsx`.

---

## Notifications

Notifications can be sent from Functions, with service code in `apps/functions/src/services`.

- **SMS:** Twilio
- **Email:** SendGrid

Both services are ready to use.
