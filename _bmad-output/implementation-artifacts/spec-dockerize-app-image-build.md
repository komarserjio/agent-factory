---
title: 'Dockerized Application Image Build'
type: 'feature'
created: '2026-08-09'
status: 'done'
review_loop_iteration: 0
baseline_commit: '65ab9e3db99c28a26f961ea05b3319b64ee1bdb7'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The Node.js/TypeScript application cannot currently be run as a portable container and has no automated validation of its container image.

**Approach:** Provide a production-ready Docker image definition and GitHub Actions workflow that builds and publishes the image to GitHub Container Registry whenever relevant application or container files change.

## Boundaries & Constraints

**Always:** Build the existing TypeScript application inside a multi-stage container image; run the production image as a non-root user; serve on port `3000` by default while preserving `PORT` configuration; keep the runtime image free of development dependencies; use the existing Node 24-compatible dependency lockfile; publish successful GitHub Actions builds to GitHub Container Registry using the repository token and least-privilege package-write permission.

**Ask First:** Ask before adding a registry other than GitHub Container Registry, image tagging policies beyond branch, pull-request, and commit identifiers, or deployment infrastructure.

**Never:** Do not change the HTTP endpoint behavior, add a container orchestrator configuration, commit build artifacts, or require new application runtime dependencies.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| LOCAL_BUILD | Docker build from repository root | Image compiles TypeScript and completes successfully | Build fails immediately on dependency or compilation failure |
| CONTAINER_REQUEST | Container runs with port `3000` mapped | `GET /` responds with the existing JSON welcome message | Existing JSON not-found behavior is retained |
| CI_BUILD | Pull request or push changes container/application inputs | GitHub Actions builds and publishes a tagged image to GitHub Container Registry | Workflow fails visibly when the image cannot build or publish |
| IRRELEVANT_CHANGE | Only unrelated project artifacts change | Docker build workflow does not run automatically | Manual dispatch remains available |

</frozen-after-approval>

## Code Map

- `Dockerfile` -- multi-stage build and production runtime definition.
- `.dockerignore` -- excludes source-control, tooling, generated, and local-only files from build context.
- `.github/workflows/docker-build.yml` -- GitHub Actions image-build and GitHub Container Registry publishing workflow.
- `src/server.ts` -- existing application entry point invoked by the container.
- `package-lock.json` -- deterministic dependency installation input.

## Tasks & Acceptance

**Execution:**
- [x] `Dockerfile` -- add a Node 24 Alpine multi-stage build that compiles TypeScript and runs only compiled output as a non-root user -- create a production container without runtime development dependencies.
- [x] `.dockerignore` -- omit dependencies, compiler output, VCS, agent tooling, local environment files, and editor artifacts -- minimize and stabilize the Docker build context.
- [x] `.github/workflows/docker-build.yml` -- build and publish the image to GitHub Container Registry on relevant pull requests, pushes to `main`, and manual dispatch using Buildx and GitHub Actions cache -- continuously validate and distribute the container definition.
- [x] `README.md` -- document the local Docker build and run commands -- make container usage discoverable.

**Acceptance Criteria:**
- Given Docker is available, when the image is built from the repository root, then the build completes and the final stage contains only the compiled application required to start it.
- Given the image runs with `-p 3000:3000`, when a client requests `GET /`, then it receives the existing HTTP 200 JSON welcome response.
- Given a pull request targets `main` or relevant files are pushed to `main`, when GitHub Actions evaluates the change, then it authenticates with `GITHUB_TOKEN` and publishes a tagged image to `ghcr.io`.
- Given the workflow runs, when it publishes the image, then it uses the repository-scoped `GITHUB_TOKEN` and `packages: write` permission without additional registry secrets.

## Verification

**Commands:**
- `docker build -t node-typescript-hello-world:local .` -- expected: multi-stage image build succeeds.
- `docker run --rm -d --name node-typescript-hello-world -p 3000:3000 node-typescript-hello-world:local` -- expected: container starts successfully.
- `curl --fail-with-body http://127.0.0.1:3000/` -- expected: HTTP 200 JSON welcome message.
- `docker stop node-typescript-hello-world` -- expected: test container stops cleanly.

## Suggested Review Order

**Container runtime**

- Two stages keep compilers and development dependencies out of the production image.
  [`Dockerfile:1`](../../Dockerfile#L1)

- The runtime uses Node's non-root account and retains configurable port support.
  [`Dockerfile:16`](../../Dockerfile#L16)

**Image publishing**

- The workflow grants only read and package-write permissions needed for GHCR publication.
  [`docker-build.yml:26`](../../.github/workflows/docker-build.yml#L26)

- Fork pull requests build safely without credentials; trusted contexts publish the image.
  [`docker-build.yml:33`](../../.github/workflows/docker-build.yml#L33)

- Immutable action revisions protect the package-write workflow from mutable action tags.
  [`docker-build.yml:37`](../../.github/workflows/docker-build.yml#L37)

**Supporting files**

- The build context excludes local and unrelated project material.
  [`.dockerignore:1`](../../.dockerignore#L1)

- Docker commands document the local image build and port configuration.
  [`README.md:21`](../../README.md#L21)
