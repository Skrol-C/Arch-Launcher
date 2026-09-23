# Phase 0 — contracts and fixtures

Status: foundation shell started; no real game files are touched.

## Current slice

- Tauri-compatible React/Vite shell
- Arch Creator-inspired visual language
- Home, library, tools, controller hub, jobs, settings navigation placeholders
- Phase 0 contract cards
- No filesystem scanning, external-process launch, SQLite writes, or metadata requests yet

## Next slices

1. Add domain types and SQLite schema/migration contract.
2. Add fixture library and scanner tests.
3. Add first-run setup state machine.
4. Add read-only Steam manifest parser.
5. Add tool detection and pending identity matches.
6. Wire the real Tauri shell after the web contract is stable.

## Safety gate

No live game directory or external manager is mutated in Phase 0.
