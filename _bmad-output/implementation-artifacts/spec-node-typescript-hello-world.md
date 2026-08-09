---
title: 'Node.js TypeScript Hello World HTTP Application'
type: 'feature'
created: '2026-08-09'
status: 'done'
review_loop_iteration: 0
baseline_commit: '5b025cdd55f1cbdde28f8da43edda7ebcd34f933'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The repository currently contains a client-side static application, but the requested deliverable is a Node.js/TypeScript hello-world application.

**Approach:** Replace the static entry point with a minimal HTTP server that returns a welcome message as JSON from the root endpoint and provide the scripts and compiler configuration needed to build and run it.

## Boundaries & Constraints

**Always:** Use TypeScript targeting Node.js; expose `GET /`; return valid JSON with an explicit JSON content type; keep the implementation dependency-light; make the server port configurable through `PORT` with a local default.

**Ask First:** None. The requested behavior is sufficiently defined.

**Never:** Do not retain or recreate `index.html`; do not add a frontend framework, database, external API, or endpoints beyond the hello-world response and a basic not-found response.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| HAPPY_PATH | `GET /` | HTTP 200, `Content-Type: application/json`, and a JSON welcome message | N/A |
| UNKNOWN_PATH | Any request path other than `/` | HTTP 404 with a JSON not-found message | Return JSON error response without throwing |
| CONFIGURED_PORT | `PORT` environment variable is set | Server listens on the configured port | Use the default port when unset |

</frozen-after-approval>

## Code Map

- `src/server.ts` -- Node.js HTTP server and JSON endpoint behavior.
- `package.json` -- project metadata and build/start scripts.
- `tsconfig.json` -- TypeScript compiler settings for the Node server.

## Tasks & Acceptance

**Execution:**
- [x] `package.json` -- define TypeScript build and production start scripts plus required development dependencies -- make the app installable and runnable.
- [x] `tsconfig.json` -- configure strict TypeScript compilation into `dist/` -- produce runnable JavaScript without source edits.
- [x] `src/server.ts` -- implement the configurable-port HTTP server and JSON responses -- provide the requested root endpoint and safe not-found behavior.
- [x] `README.md` -- document installation, build, start, and endpoint usage -- make the new application discoverable.

**Acceptance Criteria:**
- Given the project dependencies are installed, when `npm run build` runs, then TypeScript compiles successfully into `dist/`.
- Given the built server is running, when a client requests `GET /`, then it receives HTTP 200 and valid JSON containing a welcome message.
- Given the built server is running, when a client requests a non-root path, then it receives HTTP 404 and valid JSON.
- Given `PORT` is set, when the server starts, then it listens on that port.

## Verification

**Commands:**
- `npm install` -- expected: dependencies install successfully.
- `npm run build` -- expected: TypeScript compilation succeeds.
- `npm start` with `curl` against `/` and an unknown path -- expected: JSON 200 root response and JSON 404 unknown-path response.

## Suggested Review Order

**HTTP behavior**

- The built-in HTTP server keeps the hello-world surface dependency-light.
  [`server.ts:9`](../../src/server.ts#L9)

- Root and unknown paths receive explicit JSON status responses.
  [`server.ts:11`](../../src/server.ts#L11)

- Port configuration supports environment-based deployment with a local default.
  [`server.ts:3`](../../src/server.ts#L3)

**Project setup**

- Build and start scripts define the application lifecycle.
  [`package.json:5`](../../package.json#L5)

- Strict compiler settings produce runnable JavaScript in `dist/`.
  [`tsconfig.json:2`](../../tsconfig.json#L2)

- Usage instructions document installation, execution, and endpoint behavior.
  [`README.md:5`](../../README.md#L5)

- Generated dependencies and build output remain untracked.
  [`.gitignore:1`](../../.gitignore#L1)
