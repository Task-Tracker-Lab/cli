# TTOPEN CLI

Infrastructure-as-Code (IaC) helper for Task Tracker deployments.
Designed for deterministic environment provisioning.

## DESIGN PHILOSOPHY

- `Single Source of Truth`: Centralized .env management.
- `Hardened Defaults`: Production-ready security out of the box.
- `Atomic Diagnostics`: Isolated checks for Docker, Network, and OS.
- `User-Centric UX`: Intelligent branching (Simple vs. Advanced).

## ARCHITECTURE

- `/bin` Runtime entry point
- `/commands` Domain logic (init, docker, network)
- `/configs` Type-safe schemas & constants
- `/utils` Core drivers (crypto, logger, theme)

## QUICK START

```bash
pnpm build
pnpm link --global
```

## CORE COMMANDS

- `init` [-a] Interactive .env setup (Simple/Advanced modes)
- `docker` Engine & Swarm mode diagnostics
- `ethernet` Connectivity & registry audit

## UI SPECIFICATION

- `Accent`: `Cyan` (Primary actions)
- `Secondary`: `Dim` (Metadata & paths)
- `Status`: `Succeed`/`Fail` semantic coloring

## SECURITY PROTOCOL

- Zero-exposure: All secrets generated locally via crypto.randomBytes
- Hardened: Base32 encoding for human-readable, machine-safe passwords
- Logic: Automatic entropy injection for JWT and Database credentials

## License

Licensed under the [MIT license](https://github.com/Task-Tracker-Lab/core/blob/master/LICENSE).

---

© 2026 TTOPEN. Minimalist by design. Reliable by default.
