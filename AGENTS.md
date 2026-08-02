# AGENTS

## Project Overview

- Project Name: Mu
- Repository URL: n/a yet
- Purpose: Build a normalized music library from audio files. Exposed as an
  engine and a CLI.
- Stack:
  - Runtime: Node.js LTS
  - Package Manager: Bun 1.x
  - Formatter: dprint
  - Test Runner: `node:test` (not `bun test`)

## Setup & Commands

- Install deps: `bun install`
- Run tests: `node --test` (not `bun test`)
- Format files: `dprint fmt`
- Type Checking: `bunx tsc`

## Architecture

The indexing engine is a streaming pipeline: ingest → normalize → ids → library

Each stage has a single responsibility and should not know implementation
details of later stages. Don't collect the full file list into memory before
processing.

1. Ingest extracts raw metadata from audio files, using `npm:taglib-wasm`
2. Normalization produces canonical metadata.
3. Generate deterministic IDs for entities, using composite keys. The same
   logical entity should receive the same ID regardless of scan order or
   machine. IDs must never depend on insertion order or random values.
4. The library builder creates entities, deduplicates them, resolves
   relationships, and constructs the graph.

## Structure

- `src/cli` - CLI entrypoint (todo)
- `src/lib` - Indexing engine
  - `models`, `ingest`, `normalize`, `ids`, `library`
- `src/shared` - Cross-cutting utils

## Conventions

**Behavior**:

- Diagnostics vs. exceptions: use diagnostic objects (see
  `src/shared/diagnostic.ts`) for anything recoverable — malformed tags, missing
  fields, ambiguous metadata. Diagnostics are collected, not thrown, and must
  never halt execution. Reserve native exceptions for truly unrecoverable
  failures.
- For entity relations, use the `Ref` interface from
  `src/lib/models/entities.ts` instead of raw ID strings. This helps identify
  what kind of entity the ID belongs to.

**Style**:

- Methods should have a JSDoc comment including a brief summary of what the
  method does.
- Files should have a deno-style JSDoc comment including a brief summary of what
  the module does, ending an `@module` tag.

**Naming**:

- Functions: verbs (`buildLibrary`, `normalizeArtist`)
- Interfaces/types: nouns (`Track`, `Album`)
- Constants: UPPER_SNAKE_CASE only when truly constant

## Testing Expectation

- Test files live next to the file they test, named `*.test.ts`
- Use `node:assert/strict` for test assertions
- Tests should describe observable behavior, not implementation details.
  - Write tests using the Arrange-Act-Assert pattern
  - Use BDD conventions where possible

## Do's and Dont's

- Do not introduce new runtime dependencies without a compelling reason. Prefer
  the standard library where practical.
- Stream input whenever possible
