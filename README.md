# Next.js FSD Boilerplate

Personal fullstack starter: **Next.js 16** (App Router, Cache Components, React Compiler) organized with
**[Feature-Sliced Design](https://feature-sliced.design)**, linted by **oxlint** + **Steiger**, formatted by **oxfmt**,
tested with **Vitest** + **Playwright**, backed by **Postgres** + **Drizzle**.

## Quick start

```bash
bun install                  # also installs git hooks (lefthook)
cp .env.example .env.local
bun run db:up                # Postgres 17 in Docker, host port 54329
bun run db:migrate
bun run dev
```

## Folder layout

| Path           | What lives there                                                                             |
| -------------- | -------------------------------------------------------------------------------------------- |
| `app/`         | **Next.js routing only.** Every file is a one-line re-export from `src/`.                    |
| `pages/`       | Empty on purpose: it makes Next ignore `src/pages`. Don't add files.                         |
| `src/app`      | FSD **app** layer: root layout, global styles, route handler implementations (`api-routes`). |
| `src/pages`    | Page slices: compose widgets for one route.                                                  |
| `src/widgets`  | Large self-contained UI blocks.                                                              |
| `src/features` | User interactions that deliver value (forms + server actions).                               |
| `src/entities` | Business entities: DB tables, queries, entity UI.                                            |
| `src/shared`   | Business-agnostic code: `config`, `db`, `ui`, `lib`.                                         |

## Import rules (enforced)

- A layer imports only from layers **below** it: app → pages → widgets → features → entities → shared.
- No imports between slices on the same layer. Entities may reference each other only via `@x`
  (`@/entities/user/@x/todo`).
- Across slices, import only the **public API**: `@/features/create-todo`, never `@/features/create-todo/ui/...`.
  Inside a slice, use relative imports. `shared` and `app` are imported by segment (`@/shared/ui/button`).
- Server-only exports go in the slice's `index.server.ts` (first line `import "server-only";`).
  Import it as `@/entities/todo/index.server`.
- Files with `"use client"` are named `*.client.tsx`; they may not import `index.server` or `server-only`.

`bun run lint` (oxlint + eslint-plugin-boundaries) checks imports; `bun run lint:fsd` (Steiger) checks structure;
`bun run lint:rules` proves the rules still catch violations.

## Where server code goes

| Concern        | Location                                                                                 |
| -------------- | ---------------------------------------------------------------------------------------- |
| DB client      | `src/shared/db` (`getDb()`)                                                              |
| Env vars       | `src/shared/config` (`getServerEnv()`, validated with zod)                               |
| Tables         | `src/entities/<x>/model/<x>.schema.ts` (picked up by `drizzle.config.ts`)                |
| Reads          | `src/entities/<x>/api/*`, exported from `index.server.ts`, called from server components |
| Writes         | `src/features/<x>/api/*.action.ts` (`"use server"`)                                      |
| Route handlers | `src/app/api-routes`, re-exported from `app/api/**/route.ts`                             |

## Tests

- Unit: colocate `*.test.ts(x)` next to the file under test. Shared helpers: `@/shared/lib/test`.
  Test files are exempt from the FSD import rules.
- E2E: `tests/e2e/` (Playwright). Needs a running, migrated DB; builds and serves the app on port 3100.

## Scripts

| Script                                               | Does                                                                         |
| ---------------------------------------------------- | ---------------------------------------------------------------------------- |
| `dev` / `build` / `start`                            | Next.js                                                                      |
| `check`                                              | format check + lint + FSD lint + lint-rule fixtures + typecheck + unit tests |
| `lint` / `lint:fsd` / `lint:rules`                   | oxlint / Steiger / fixture verification                                      |
| `format` / `format:check`                            | oxfmt                                                                        |
| `typecheck`                                          | `tsc --noEmit`                                                               |
| `test` / `test:watch` / `test:e2e`                   | Vitest / Vitest watch / Playwright                                           |
| `db:up` / `db:generate` / `db:migrate` / `db:studio` | Docker Postgres / Drizzle Kit                                                |

Git hooks: pre-commit runs oxfmt + oxlint on staged files and Steiger; pre-push runs typecheck + unit tests.

## Removing the example

The todo example is meant to be deleted:

1. Delete `src/entities/todo`, `src/features/create-todo`, `src/widgets/todo-list`, `tests/e2e/todo.spec.ts`.
2. Replace the body of `src/pages/home/ui/home-page.tsx`.
3. Remove the example-slices block from `steiger.config.ts`.
4. Delete `drizzle/` and run `bun run db:generate` once you have your own tables.
