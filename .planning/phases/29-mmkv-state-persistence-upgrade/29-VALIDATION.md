---
phase: 29
slug: mmkv-state-persistence-upgrade
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-25
---

# Phase 29 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js built-in test runner (`node --test --import tsx`) |
| **Config file** | none — scripts in package.json |
| **Quick run command** | `npm run test:release` |
| **Full suite command** | `node --test --import tsx "src/**/*.test.ts"` |
| **Estimated runtime** | ~3 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run test:release`
- **After every plan wave:** Run `npm run test:release`
- **Before `/gsd:verify-work`:** Full suite must be green + manual device smoke test (new dev build required — MMKV is a native module)
- **Max feedback latency:** ~3 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 29-01-01 | 01 | 0 | MMKV-adapter | unit | `node --test --import tsx src/stores/mmkvStorage.test.ts` | ❌ W0 | ⬜ pending |
| 29-01-02 | 01 | 0 | Migration | unit | `node --test --import tsx src/stores/migrateFromAsyncStorage.test.ts` | ❌ W0 | ⬜ pending |
| 29-01-03 | 01 | 1 | Store rehydration | unit | `npm run test:release` | ✅ existing | ⬜ pending |
| 29-01-04 | 01 | 1 | Auth no-token | unit | `node --test --import tsx src/stores/authStore.test.ts` | ✅ existing | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/stores/mmkvStorage.ts` — shared MMKV Zustand storage adapter (production code)
- [ ] `src/stores/mmkvStorage.test.ts` — tests adapter behavior with a Map-based mock of MMKV
- [ ] `src/stores/migrateFromAsyncStorage.ts` — one-time migration helper (copies existing AsyncStorage data to MMKV on first launch)
- [ ] `src/stores/migrateFromAsyncStorage.test.ts` — covers migration logic with mocked MMKV + AsyncStorage
- [ ] Node test mock strategy for `react-native-mmkv` — create a manual stub file at `src/__mocks__/react-native-mmkv.ts` or use `--import` shim (project uses Node native runner, not Jest)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Cold-start feels faster after MMKV swap | Performance | Can't measure native startup in Node | Build dev client, kill app, cold launch, observe store data available immediately |
| Existing user data survives upgrade (no data loss) | Migration | Requires real AsyncStorage data on device | Install old build, set preferences, upgrade to new build, verify data persisted |
| MMKV native module loads without crash | Native | Node tests can't test native modules | `npx expo run:ios`, launch app, verify no red screen |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
