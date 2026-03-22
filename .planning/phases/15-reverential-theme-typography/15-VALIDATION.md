---
phase: 15
slug: reverential-theme-typography
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-22
---

# Phase 15 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | jest (via expo) |
| **Config file** | package.json (jest config section) |
| **Quick run command** | `npm run typecheck` |
| **Full suite command** | `npm run release:verify` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run typecheck`
- **After every plan wave:** Run `npm run release:verify`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| TBD | TBD | TBD | M2-DESIGN-01 | typecheck | `npm run typecheck` | TBD | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. TypeScript strict mode catches type errors from theme interface changes. Release verification suite covers lint + typecheck + metadata.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Dark mode visual warmth | M2-DESIGN-01 | Visual quality cannot be automated | Compare screenshots against reference images in .context/attachments/ |
| Light mode visual warmth | M2-DESIGN-01 | Visual quality cannot be automated | Verify warm cream/off-white backgrounds, not clinical blue-white |
| Low-light/sepia mode | M2-DESIGN-01 | New mode, visual quality check | Verify amber/candlelight tones, comfortable for dark room reading |
| Custom font rendering | M2-DESIGN-01 | Font rendering varies by device | Check Lora serif rendering on iOS and Android at various font sizes |
| Generic pattern removal | M2-DESIGN-01 | Design quality is subjective | Verify rounded corners reduced, nested cards removed, shadows stripped |
| Hardcoded color elimination | M2-DESIGN-01 | Full coverage check | Switch between all 3 theme modes, verify no hardcoded colors bleed through |

*If none: "All phase behaviors have automated verification."*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
