# PostHog Self-driving Setup Report

**Project:** Lingua (AI Language Learning App — Expo / React Native)
**Date:** 2026-08-29
**Inbox:** https://us.posthog.com/project/584248/inbox

## Summary

PostHog Self-driving has been configured for the Lingua Expo app. Session Replay, Error Tracking, and Support products are on; six native signal sources and five scouts are enabled to watch product analytics, feature flags, health, and observability gaps. Two Replay Vision scanners are armed to catch on-screen breakage and learner frustration the moment mobile session recordings start arriving. Findings will begin appearing in the [Self-driving inbox](https://us.posthog.com/project/584248/inbox) within ~30 minutes.

---

## AI data processing

**Status:** Approved. Organization-level AI data processing consent was granted before this run.

---

## GitHub

**Status:** Already connected (integration `mustafaxkhattak`, id 258897, connected 2026-08-29).

---

## Products enabled

| Product | Status | Note |
|---|---|---|
| Session Replay | Already enabled (inert) | Server flip is ON. Mobile replay needs `enableSessionReplay: true` added to the PostHog SDK init in `src/config/posthog.ts` before recordings arrive. See follow-ups. |
| Error Tracking | Already enabled (inert) | Server flip is ON. Exception autocapture needs SDK configuration in `src/config/posthog.ts`. See follow-ups. |
| Support (Conversations) | Enabled | Turned on this run. Tickets only arrive once an inbound channel (email / inbox / Slack) is connected in PostHog. See follow-ups. |

This is a pure mobile app (`posthog-react-native` v4.66.2). The `posthog.init` override check is not applicable — there is no `posthog-js` init to audit.

---

## Signal sources

| source_product | source_type | Action | Note |
|---|---|---|---|
| `signals_scout` | `cross_source_issue` | Skipped — on by default | Scout findings reach the inbox without a config row. |
| `health_checks` | `health_issue` | **Enabled** (id `01a04eda-91f8-...`) | |
| `error_tracking` | `issue_created` | **Enabled** (id `01a04eda-9710-...`) | |
| `error_tracking` | `issue_reopened` | **Enabled** (id `01a04eda-9918-...`) | |
| `error_tracking` | `issue_spiking` | **Enabled** (id `01a04eda-a9c9-...`) | |
| `session_replay` | `session_analysis_cluster` | **Enabled** (id `01a04eda-aed2-...`) | Server-side sample rate 10%. Will be idle until mobile replay is configured. |
| `conversations` | `ticket` | **Enabled** (id `01a04eda-b105-...`) | Idle until an inbound channel is connected. |

---

## Connected tools

No external issue-tracker, error-tracker, support-desk, or other connected tools were selected. All catalog tools are **not used**.

---

## Scout troop

**Run budget:** 100 runs/day max · 0 used today  
**Banner:** "Scouts are in early access. Each project gets up to 100 scout runs a day. Contact team-self-driving@posthog.com if you need more."  
**Total enabled:** 5 scouts · **Total disabled:** 22 scouts

### Enabled scouts

| Scout | Watches |
|---|---|
| `signals-scout-general` | Cross-product correlations and surfaces no specialist covers. Always on. |
| `signals-scout-feature-flags` | Flag evaluation cliffs, ghost flags, response-distribution shifts, flag debt. Enabled because the SDK explicitly configures `preloadFeatureFlags: true` and `sendFeatureFlagEvent: true`. |
| `signals-scout-health-checks` | PostHog setup health issues — high blast-radius ones surfaced to inbox. Enabled because this is a fresh integration. |
| `signals-scout-observability-gaps` | Event volumes with no insight, dashboard, or alert coverage. Enabled to surface what isn't tracked yet as the app grows. |
| `signals-scout-product-analytics` | Funnel, retention, and lifecycle regressions in saved insights. Enabled because product analytics (screen views, touch autocapture, lifecycle events) is the primary PostHog surface in use. |

### Disabled scouts (notable reasons)

| Scout | Reason |
|---|---|
| `signals-scout-error-tracking` | Covered by native error-tracking source (step 4). Intentional — not a re-enable follow-up. |
| `signals-scout-session-replay` | Covered by native session-replay source (step 4). Intentional — not a re-enable follow-up. |
| `signals-scout-web-analytics` | Mobile-only app — no web traffic. Enable if you add a web landing page. |
| `signals-scout-web-vitals` | Mobile-only — Core Web Vitals are web-only. |
| `signals-scout-ai-observability` | No `$ai_*` events or LLM SDK instrumented yet. Enable once Stream Vision Agent telemetry is captured. |
| `signals-scout-revenue-analytics` | No payment SDK or revenue data. Enable if you add in-app purchases. |
| `signals-scout-surveys` | No surveys in use. Enable if you add PostHog surveys. |
| `signals-scout-experiments` | No active A/B experiments. Enable when you run experiments. |
| `signals-scout-logs` | PostHog logs product not in use. |
| `signals-scout-csp-violations` | No Content-Security-Policy reporting (mobile app). |
| All others | Not applicable to this project's current surfaces. |

**Noise escape hatch:** If any scout becomes noisy, set `emit: false` on its config in PostHog to switch it to dry-run (it still runs and logs, but writes nothing to the inbox).

---

## Custom scouts

**Two candidates were proposed; both were declined (user cancelled the prompt).**

### Proposed but declined

| Candidate | Surface | Discriminator | Why no built-in covers it |
|---|---|---|---|
| Activation funnel | `onboarding_get_started_pressed` → `language_selected` → `user_signed_up`/`user_signed_in` | Conversion rate drop at any funnel step vs rolling 7-day baseline | `product-analytics` scout watches saved insights; no saved funnels exist yet on this fresh project |
| Daily learning engagement | `plan_item_completed` + `continue_learning_pressed` vs `Application Opened` (DAU proxy) | Engagement ratio drop per-session vs baseline | No built-in scout covers lesson-plan completion as an engagement metric |

Both proposals pass the watchability and uncovered filters. They remain available to create manually from the PostHog inbox if needed later.

### Surfaces ruled out

| Surface | Filter that killed it |
|---|---|
| AI teacher session funnel | Fails quality bar — only `ai_teacher_session_started` is captured; no completion event exists yet, so there is no success/failure pair |
| Language selection distribution | Weak discriminator — no clear success/failure pair, more of a dashboard metric |

---

## Replay Vision scanners

Scanners are LLMs that watch individual session recordings on a schedule and push what they find directly to the inbox. Each observation arrives at half weight; a report is promoted once corroboration reaches a full weight. **These are the only thing in this setup that spends Replay Vision quota.**

No mobile session recordings exist yet — the scanners are armed and start working the day recordings begin (once mobile session replay is configured in the SDK).

| Scanner | Type | Watches | Query scope | Sampling rate | Est. monthly credits |
|---|---|---|---|---|---|
| Lingua learning flow breakage | Monitor | Visible product failures: auth stuck after social login, language selection unresponsive, plan items not toggling, Continue Learning not navigating, AI teacher session blank on start, onboarding Get Started not transitioning | Mobile sessions (`snapshot_source: mobile`) — entire app since it is mobile-only | 50% | 0 (no recordings yet) |
| Lingua learner frustration | Monitor | Learners getting stuck: hammering unresponsive language cards, retrying stalled navigation, hammering social auth buttons, tapping plan checkboxes that don't toggle, repeatedly tapping the AI teacher session button when Stream fails to connect | Sessions with `$rageclick` events | 100% | 0 (no recordings yet) |

The breakage monitor uses `snapshot_source: mobile` rather than a URL filter because this app has no web surface — all sessions are from the mobile SDK. The frustration monitor uses the `$rageclick` gate (locked per brief). The two query axes are disjoint.

---

## Follow-ups

- [ ] **Enable mobile session replay in the SDK.** Add `enableSessionReplay: true` (and optionally `sessionReplayConfig`) to the PostHog init in `src/config/posthog.ts`. Without this, the server-side replay toggle is on but no mobile recordings arrive.
- [ ] **Enable exception autocapture in the SDK.** Add `enableExceptionAutocapture: true` to `src/config/posthog.ts` so crashes and unhandled errors are captured by PostHog's error tracking. Without this, the error tracking product is on but captures nothing.
- [ ] **Connect an inbound channel for Support.** The Conversations product is enabled, but tickets only flow once you connect an email, inbox, or Slack channel in PostHog → Settings → Support.
- [ ] **Enable `signals-scout-ai-observability`** once Stream Vision Agent telemetry (`$ai_*` events) is captured. This scout watches LLM cost, latency, error, and eval regressions.
- [ ] **Add lesson completion events** (`lesson_completed`, `lesson_started`, `xp_earned`) to PostHog via `posthog.capture()` so the activation and daily-learning custom scouts can be created later.
- [ ] **Create the activation funnel scout** once lesson events are instrumented and a saved funnel exists in PostHog, or trigger the Self-driving setup again to propose it.

---

## What happens next

The scout coordinator picks up the newly enabled configs within ~30 minutes and fires the first runs. Each run draws from the project's daily budget (100 runs/day during early access). Findings cluster into reports in the inbox — immediately-actionable ones can trigger coding tasks. The two Replay Vision scanners activate the moment mobile session recordings start arriving.

Check your inbox: https://us.posthog.com/project/584248/inbox
