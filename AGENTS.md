# Arch Launcher — Coding Guide

## Project

Arch Launcher is a private Windows desktop game archive and operations desk.
The permanent product plan is `PROJECT_PLAN.md`; do not silently contradict it.
Canonical research lives in the Arch OS Vault and is linked from the plan.

## Stack

- Tauri + React + TypeScript + Vite.
- Keep Rust thin: safe filesystem/process/database boundaries only.
- SQLite is the local relational index; large assets, games, ROMs, mods, and backups remain files.
- Windows desktop first.

## Current phase

Phase 0: contracts, fixtures, reusable UI, database/migration design, permissions, jobs, backup/recovery models.

Do not touch real game files, Steam manifests, saves, mod folders, emulator content, or external-tool inputs until the read-only fixture scanner and approval gates pass.

## UI rules

Reuse Arch Creator interaction primitives and visual language where possible: dialogs, confirmation boxes, toasts, sheets, buttons, cards, loading states, empty states, errors, and design tokens. Do not create parallel primitives without a reason.

The signature launcher interaction is a cover opening into a real operational workspace. Do not build a disconnected mockup that cannot be backed by the planned data contracts.

## Safety and integration rules

- External integrations declare capabilities: observe, launch, stage, mutate, network, filesystem.
- Steam, PCSX2/RPCS3, SnakeBite, and mature mod managers remain authoritative for their own state.
- Read-only before mutation. Mutations require a visible plan, explicit approval, backup where relevant, and rollback/recovery handling.
- Never log API keys, tokens, passwords, or full credential values.
- Treat archives and community files as untrusted: prevent traversal, junction/reparse-point escapes, and backups inside source trees.

## Verification

Run the project check from the repository root:

```bash
npm run check
```

Do not run release builds or package/distribute the app unless explicitly requested.

## Git

Stage exact paths only. Keep caches, credentials, build output, and local databases out of commits. Use focused commits and verify `git status` after each change.
