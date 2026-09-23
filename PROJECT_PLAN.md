# Arch Launcher — Permanent Personal Project Plan

**Status:** Proposed foundation plan
**Platform:** Windows desktop only
**Repo:** `D:/Projects/Arch Launcher`
**Stack:** Tauri + React; minimal Rust beyond Tauri boundary requirements
**Database:** Local SQLite; export/import backups
**Canonical research:** `C:/Users/banan/Documents/Arch OS Vault/Inbox/Athena/2026-09-17-athena-arch-launcher-foundation-and-mgsv-research.md`

## Product definition

Arch Launcher is a personal game archive and operations desk: a cover-based library that scans, identifies, launches, diagnoses, backs up, configures, and eventually manages games, emulators, mods, saves, controller profiles, and performance settings.

The library is hybrid: visual game covers on the surface, an operational workspace behind each cover.

## Product principles and non-negotiables

- **Personal archive first:** Arch Launcher is a private, Windows-only tool for Skrol’s own collection, not a public storefront or social platform.
- **Do not reinvent Arch Creator:** reuse the established Arch Creator design tokens and primitives for dialogs, confirmation boxes, toasts, sheets, buttons, cards, loading states, empty states, and error presentation. Launcher-specific work is the cover-opening workspace and game operations surface.
- **Real files early:** visual work can begin with fixture data, but each phase must connect to real files and real tool detection before it is considered proven. No HTML-only proof.
- **Read-only before mutation:** scans, identity matching, metadata, and health reports must work without changing game state. Mutation requires a plan, preview, explicit approval, backup where relevant, and an undo/rollback path.
- **Authorities stay authoritative:** Steam owns Steam manifests; PCSX2/RPCS3 own emulator mappings; SnakeBite owns MGSV package installation and managed archives; mature mod managers remain authoritative when Arch cannot safely integrate with them.
- **Evidence over guesses:** every detected game, tool, version, mod, backup, and health result carries evidence, confidence, source, timestamp, and warning state.
- **Offline-first:** the library, cached art, launch profiles, notes, and previous scan results remain usable without internet. Network providers enrich the archive but never become a hard runtime dependency.
- **Visible operations:** slow work is a job with progress, destination, logs, retry/cancel state, failure reason, and recoverable interruption state.
- **No silent external actions:** integrations declare capabilities (`observe`, `launch`, `stage`, `mutate`, `network`, `filesystem`) and show what will happen before running an external tool.

## Complete user experience map

### First launch

1. Welcome and choose the local data/cache/backup locations.
2. Detect Steam and common libraries; allow manual roots.
3. Detect SteamCMD, SnakeBite, Infinite Heaven/IHHook, PCSX2, RPCS3, and known managers.
4. Choose metadata providers and enter optional API keys through Windows Credential Manager.
5. Configure PS2/PS3 ROM folders and optional import folders.
6. Run a read-only scan.
7. Review pending identity matches with confidence/evidence and approve or reject them.
8. Land on Home with real library data, not a placeholder dashboard.

### Main navigation

- **Home:** continue playing, recently played, pending matches, interrupted jobs, failed health checks, and games needing attention.
- **My Library:** grid/list views, search, shelves, filters, source/platform badges, installed/uninstalled state, modded/vanilla state, and controller readiness.
- **Tools:** Steam, SteamCMD, SnakeBite, Infinite Heaven/IHHook, PCSX2, RPCS3, controller backends, and detected mod managers.
- **Controller Hub:** connected devices, capabilities, per-game profiles, backend conflicts, and connection state.
- **Jobs:** scans, artwork, imports, backups, verification, installs, patch staging, and retries.
- **Activity:** audit timeline for scans, approvals, launches, backups, repairs, profile changes, and external handoffs.
- **Settings:** paths, providers, credentials, cache, backups, permissions, appearance, database/export, and integrations.

### Game workspace

Opening a cover reveals the operational workspace behind it. The cover interaction is a signature animation, but every control is backed by real data.

- **Overview:** artwork, title, health, active installation, last launch, last backup, warnings, and primary Play button.
- **Installations:** one title can contain named entries such as Steam vanilla, modded, testing, preserved version, PS2, or PS3. Each entry records path, source, executable, tool/runner, version evidence, and active state.
- **Launch:** launch profile, executable, working directory, arguments, environment, runner/tool, controller backend, and online/offline notes.
- **Mods:** active profile, staged profiles, manager status, conflicts, load order, source/provenance, and deploy/rollback actions when supported.
- **Saves:** detected save locations, backup history, restore preview, and warnings about cloud/save races.
- **Controller:** connected device, backend, prompt style, gyro/touchpad capability, emulator mapping authority, and per-game profile.
- **Performance:** resolution, upscaler, graphics notes, frame cap, known fixes, hardware profile, and user notes.
- **Tools:** open detected external manager, open install folder, open saves/config, repair handoff, and view provider status.
- **Activity:** chronological record of what Arch observed or changed.

## Backend and data architecture

- **Desktop shell:** Tauri + React. React/TypeScript owns screens, state, visual interaction, jobs presentation, and feature orchestration. A small Rust layer owns safe filesystem/process/database boundaries; there is no cloud server or always-running local web backend in the foundation phase.
- **Database:** SQLite is the local relational index, not the storage location for game binaries or artwork. It stores games, installations, executables, sources, tools, artwork records, launch profiles, controller profiles, mod profiles, backups, scan runs, jobs, warnings, activity, and schema migrations.
- **Files:** artwork is cached as files; games, ROMs, mods, installers, and backups remain in user-selected folders. SQLite stores paths, hashes, provenance, relationships, and state.
- **Exports:** provide JSON/settings export and a rebuild-from-scan path. SQLite is not the only copy of user intent; later add a documented human-readable sidecar/export format inspired by Pegasus.
- **Concurrency:** background workers, lazy artwork loading, virtualized library grids, incremental manifest reads, bounded metadata requests, WAL mode, and resumable jobs.
- **Security:** canonicalize Windows paths, detect junctions/reparse points, prevent backup destinations inside sources, defend against archive traversal, narrow Tauri commands, and never expose arbitrary command execution directly to React.

## Core entities and relationships

`Game -> Installation/Version -> Source, Executable, Runner/Tool, Artwork, LaunchProfile, ControllerProfile, ModProfile, SaveBackup, HealthCheck, ScanRecord, Job, ActivityEvent, Warning`

- **Game:** canonical identity, title, aliases, platform, user notes, shelves, and locked metadata.
- **Installation:** path, source, version label, executable candidates, runner, health, active flag, and evidence.
- **Source:** Steam AppID, manual folder, PS2/PS3 ROM, emulator, external tool, or user import.
- **Tool:** executable path, version, detected capabilities, permissions, authority, and last-seen evidence.
- **Artwork:** provider, provider ID, kind, source URL, local path/hash, dimensions, fetched/stale state, attribution/license, and user-lock flag.
- **Job:** queued/running/completed/failed/cancelled/interrupted state, progress, logs, inputs, outputs, retry data, and cancellation capability.

## Provider and integration contracts

Every provider declares its capabilities and authority instead of pretending all platforms behave the same:

- `observe`: read identity/state.
- `launch`: start a game/tool with a profile.
- `stage`: prepare files without changing the active install.
- `mutate`: change game/tool state, always previewed and approved.
- `network`: required network access.
- `filesystem`: exact paths it may read/write.

Initial provider order: local locked record -> SteamGridDB artwork -> Steam/Valve Steam identity/assets -> optional IGDB metadata -> later opt-in providers. Provider disable, cache purge, attribution, license, stale state, and API-key removal must exist.

## Phase 0 — contracts, fixtures, and reusable UI

- Finalize navigation map, SQLite schema, provider/tool interfaces, permissions, jobs, backup, migration, and recovery models.
- Extract/reuse Arch Creator dialogs, toasts, cards, sheets, loading/error/empty states, and design tokens; do not build parallel primitives.
- Create fixture libraries for Steam manifests, duplicate installs, missing executables, manual games, PS2/PS3 folders, fake SnakeBite evidence, broken manifests, stale art, interrupted jobs, and unknown executables.
- Write acceptance tests and data contracts before touching the real library.
- Prove database backup/migration/rebuild behavior.

## Phase 1 — real inventory and launch surface

Phase 1 is complete when Arch can:

- configure Steam roots, manual game folders, PS2 ROM folders, and PS3 ROM folders;
- read Steam `libraryfolders.vdf` and `appmanifest_*.acf` without writing;
- detect Steam, SteamCMD, SnakeBite, Infinite Heaven/IHHook, PCSX2, RPCS3, and known installed mod managers;
- scan executables and folders and create candidate game matches with confidence/evidence;
- ask for approval when identity is uncertain;
- merge duplicate installations into one game card with named installation/version entries;
- cache SteamGridDB artwork (cover, hero/banner, logo, icon, screenshots, animated art where available);
- remain usable offline from cached SQLite data and artwork;
- provide launch profiles and visible tool paths;
- show warnings, scan history, and unverified external-manager states.

### Phase 1 safety boundary

Phase 1 is read-only for game-manager state. It does not edit Steam manifests, emulator content, SnakeBite files, Infinite Heaven files, save files, or external-tool inputs. Missing tools may be offered through official download links, but installation requires explicit confirmation.

## Phase 2 — verified backups and game health

- User-triggered, configurable Arch backup storage outside the source tree.
- Backup saves, configuration, external-manager metadata, active-mod evidence, and files Arch would later change.
- Manifest-backed, verified backup records.
- Health checks using hashes and file evidence.
- Repair plans that explain proposed changes before approval.
- Provider-aware repair handoffs rather than arbitrary internet patching.

## Phase 3 — mod operations

- Arch Mod Manager with Nexus Mods as the first source adapter.
- Download to staging, inspect archive contents, show planned file changes, then require approval.
- Per-game mod profiles with Vanilla/Modded/Experimental collections.
- Links/reflinks first; safe-copy fallback.
- Conflict detection and explicit load-order decisions.
- Existing managers use a capability ladder: official API/CLI, profile-file integration, filesystem detection, launch-only fallback.
- Unsupported managers are explicitly marked unsupported/unverified.
- Mature managers remain authoritative; Arch aggregates rather than fights them.

### MGSV adapter

SnakeBite remains authoritative. Arch detects and reports Steam/MGSV paths, `snakebite.xml`, `.mgsv` packages, `.original` backups, presets, `mod`, Infinite Heaven/IHHook evidence, save paths, and warnings. Arch inspects packages safely but hands `.mgsv` installation to SnakeBite. Native deployment is not a Phase 1 feature.

The first MGSV proof is read-only detection plus verified backup, followed later by Vanilla/Modded profile visibility and rollback only after the research and backup model are proven.

## Phase 4 — emulator operations

- Detect/configure PCSX2 and RPCS3.
- Manual ROM-folder selection and cached metadata.
- Emulator launch profiles, controller mappings, and performance presets.
- Import user-supplied ROMs; no silent ROM acquisition.

## Phase 5 — external tools and preservation workflow

- Detect and open configured external tools.
- Watch user-selected output/import folders.
- Import completed results after executable detection and user confirmation.
- Record source/tool, version, path, health, and launch history.
- Keep external actions visible and logged.

## Data model direction

`Game -> Installation/Version -> Source, Executable, Tool, Artwork, ModProfile, SaveBackup, LaunchProfile, ScanRecord, Warning`

API keys live in Windows Credential Manager. Artwork is cached locally with provider, source URL, hash, dimensions, fetched time, stale state, attribution, and license metadata. Metadata order: local/user-locked record -> SteamGridDB for visual art -> Steam/Valve for Steam identity and native metadata -> optional IGDB fallback -> later opt-in providers. Cache purge and provider disable must exist from the start; free API access does not automatically grant artwork redistribution rights.

## Controller Hub (Phase 1 discovery, later implementation)

Arch should be a controller hub above Steam Input, emulator input systems, and external backends—not a replacement for every driver.

- Detect DualShock 4, Xbox/XInput, generic HID, USB/Bluetooth connection, battery, gyro, touchpad, lightbar, and speaker capabilities where Windows exposes them.
- Store per-game controller profiles describing native input, XInput translation, Steam Input, external backend, emulator target, mappings, and prompts.
- Detect and optionally launch installed controller backends; prevent double-virtualization warnings.
- Let PCSX2/RPCS3 remain authoritative for emulator mappings while Arch selects profiles and restores prior state.
- Do not build a custom kernel driver in Phase 1. Research driver options only after user-mode detection/profile orchestration is proven; the retired ViGEmBus route is not a foundation.

## Competitor-derived design rules

- Copy Playnite’s unified library, extension/capability model, fullscreen/controller browse mode, and portable/local-first operation.
- Copy LaunchBox/Big Box’s rich cover/media grammar, manuals/documents, session history, and emulator import workflow.
- Copy Pegasus’s human-readable export/sidecar metadata so SQLite is not the only representation of user intent.
- Copy Lutris’s runner abstraction: game → installation/version → executable → tool/emulator/runner → arguments/profile.
- Copy Heroic’s narrow provider adapters with visible authentication, capabilities, offline state, and per-game tools.
- Copy Hydra/LaunchBox job feedback: progress, destination, pause/cancel where safe, retry, throughput, and actionable errors; do not copy opaque downloader/provenance behavior.
- Add Arch’s differentiators: identity confidence, named installations, health evidence, repair previews, provenance, backups, and an operations ledger.
- Keep manuals/documents, achievements, trailers, and richer media as later additions rather than Phase 1 blockers.

## Distinctive features

- Cover opening into the operational workspace.
- Game health and evidence panel.
- Named installations across drives.
- Personal archive notes and activity timeline.
- Controller-aware compatibility and performance profiles.
- Mod safety, staged profiles, backups, and rollback previews.
- Offline-first library.

## Shared UI rule

Do not reinvent Arch Creator UI primitives. Reuse or extract the proven Arch Creator components and tokens for dialogs, confirmation boxes, toasts, sheets, buttons, cards, empty states, loading states, and error presentation. Arch Launcher may add launcher-specific visuals, but common interaction language should remain consistent across Arch Studios apps.

## Phased implementation roadmap

### Phase 0 — contracts and fixtures

- Finalize navigation map, data contracts, SQLite schema, provider/tool interfaces, permissions, jobs, backup, migration, and recovery models.
- Build a fixture library containing Steam-like installs, duplicate versions, missing executables, manual games, PS2/PS3 folders, fake SnakeBite evidence, broken manifests, and unknown executables.
- Define acceptance tests before touching real libraries.
- Reuse Arch Creator dialogs/toasts and interaction primitives rather than creating parallel components.

### Phase 1 — library foundation

- First-run setup: choose folders, detect Steam/tools/emulators, choose metadata providers and backup location, then scan/review matches.
- Scan Steam/manual/PS2/PS3 sources into SQLite.
- Pending identity matches with confidence and approval.
- SteamGridDB artwork cache plus Steam/Valve identity fallback; offline library.
- Search, filters, shelves, duplicate-install entries, and launch profiles.
- Cover-opening operational workspace using real data contracts.

### Phase 2 — operational reliability

- Visible jobs system: scans, artwork, imports, installs, backups, verification, and retries.
- Activity/audit timeline and structured logs.
- Health checks, repair previews, targeted backups, restore, interrupted-operation recovery.
- JSON/settings export, database rebuild from scans, migrations, and backup-before-migration.
- No silent mutation of game-manager state.

### Phase 2.5 — patch and compatibility hub

- Aggregate legitimate gameplay fixes, bug fixes, 60 FPS patches, widescreen patches, controller fixes, translations, texture packs, emulator compatibility patches, and PCGamingWiki guidance.
- Match patches by title ID, region, emulator, game version, checksum, patch format, and compatibility notes.
- Show source, version, files, licensing/provenance, and compatibility before download or import.
- Stage patches, preview changes, require approval, back up affected files, deploy, verify, and roll back.
- Support user-provided patch files and legitimate community sources; do not automate DRM, ownership, or matchmaking bypasses.

### Phase 3 — controller hub

- Detect DualShock 4, Xbox/XInput, HID, USB/Bluetooth, battery, and exposed touchpad/gyro/lightbar capabilities.
- Store per-game profiles and detect Steam Input/external backends.
- Warn about double virtualization; let PCSX2/RPCS3 remain authoritative for emulator mappings.
- Defer custom driver work until user-mode orchestration proves insufficient.

### Phase 4 — mod operations

- Arch Mod Manager with Nexus first.
- Stage, inspect, preview file changes, approve, deploy through links/reflinks, and fall back to safe copies.
- Per-game profiles, conflict/load-order decisions, backups, and rollback previews.
- Capability-ladder adapters for existing managers; unsupported managers remain explicitly unsupported.
- MGSV/SnakeBite read-only detection and verified backup first; SnakeBite remains authoritative.

### Phase 5 — emulator operations

- PCSX2/RPCS3 profiles, ROM metadata, controller mappings, performance presets, memory-card visibility, and user-supplied ROM imports.

### Phase 6 — optional polish and cloud

- Optional cloud backup after local restore is proven.
- YouTube trailers, achievements, richer themes, animated library effects, and seasonal skins.

## Acceptance gates

1. Athena research brief reviewed and this plan approved.
2. Phase 0 data contracts, fixture library, and SQLite schema reviewed.
3. Read-only scanner works against fixtures before live mutation features.
4. MGSV detector and backup manifest are verified against the real installation without modifying it.
5. Only after those gates: implement staged mod/deployment behavior.

## Explicitly out of Phase 1

Cloud backup, YouTube trailers, broad storefront integrations, native MGSV archive mutation, automatic external-tool input population, automatic repair of unknown installations, full mod deployment, and custom controller drivers.
