# HOW-TO-PLAN.md

A complete, reproducible method for planning software work. Written so that a smaller model (or a human in a hurry) can follow it mechanically and get most of the quality a stronger model produces by instinct. Follow the steps in order; do not skip a phase because the task "seems simple" — decide it is simple *after* Phase 1, not before.

The core idea: **planning quality is mostly determined by what you do before writing the plan** (investigation and question-asking), not by the eloquence of the plan itself. A smaller model that investigates thoroughly beats a larger model that guesses.

---

## Phase 0 — Classify the request (30 seconds)

Before anything, decide what kind of request this is. Each kind has a different deliverable:

| Kind | Signal | Deliverable |
|---|---|---|
| **Question / assessment** | "analizza", "valuta", "cosa ne pensi", "do you think…" | Findings and a recommendation. **Do not change code.** |
| **Small, unambiguous change** | One file, obvious fix, user named the exact thing | A short plan in your head (steps 1–3), then execute. No plan file. |
| **Feature / multi-step change** | New behavior, several files, design decisions involved | A written plan (this document's main path). |
| **Large initiative** | Multiple features, spans sessions | A plan **file** in the repo (see Phase 5) split into independently executable points. |

If you cannot classify it, it's a question — answer and ask.

**Rule: never re-litigate decisions already made.** If the user already chose the stack, the tool, or the approach (in the request, in a plan file, in memory, in CLAUDE.md), plan *within* that decision. Mention a concern once, in one sentence, if you see a real problem — then follow the decision.

---

## Phase 1 — Investigate before you plan (the most important phase)

Plans fail because they are written about an imagined codebase instead of the real one. Before writing any plan:

1. **Read the actual code you intend to touch.** Not just file names — open the files, read the relevant functions. Minimum bar: you can name the exact files and line regions each step will modify.
2. **Find the existing conventions.** Look at 1–2 similar existing implementations in the repo (a similar page, a similar component, a similar script). Your plan must extend the existing pattern, not invent a parallel one. If the repo has a way to do X, the plan uses that way.
3. **Read the project's own documentation first**: CLAUDE.md, README, docs/, existing plan/roadmap files, HANDOFF-style files. They contain decisions already made — see the rule above.
4. **Check the boundaries**: build system, CI, deploy target, schema/config files (`astro.config`, `package.json`, content collection schemas…). A step that breaks the build or violates a schema is not a valid step.
5. **Verify facts you are about to rely on.** If the plan depends on "library X supports Y" or "the frontmatter has field Z" — check it now (read the file, check the installed version), not during execution. Every unverified assumption in a plan is a landmine.

Concrete checklist before moving on — you must be able to answer all of these:
- [ ] Which files change, roughly how?
- [ ] What existing pattern am I following?
- [ ] What could this break? (build, other pages, other language version, CI, deploy)
- [ ] What did I assume without checking? → go check it or list it as an open question.

---

## Phase 2 — Ask the right questions (once, batched)

Separate what you found into three buckets:

1. **Decidable by convention** → don't ask. Pick the standard/obvious option and *state it in the plan* so the user can veto it. Examples: naming, file placement, following the existing code style, using the already-installed library.
2. **Decidable by investigation** → don't ask. Go look. Never ask a question whose answer is in the repo.
3. **Genuinely the user's call** → ask. These are: product decisions (what should it do for the user), taste/brand decisions, anything costing money, anything public-facing (published content, external services), tradeoffs where both options are defensible and the choice changes the work.

Rules for asking:
- **Batch all questions into one message**, at the start. Ten questions once beats one question ten times.
- Each question comes **with a recommended answer and why**. "Do you want A or B? I'd pick A because…" — this lets the user answer with "yes" and keeps momentum.
- If an answer would not change what you build, delete the question.
- If the user said "ask me anything you need", that is an instruction to do this phase seriously — interview first, plan after.

---

## Phase 3 — Define scope before steps

Write these four things *before* the step list. They are what makes a plan a plan instead of a todo list:

1. **Goal** — one sentence, in terms of user-visible outcome, not implementation. ("Readers can subscribe to the newsletter from the navbar and the homepage" — not "add a form component".)
2. **Non-goals** — explicitly list adjacent things you will NOT do. This is the main defense against scope creep, for both the model and the user. If during execution you're tempted to do something on this list, stop.
3. **Constraints** — the decisions already made that bound this work (stack, bilingual IT+EN pairing, existing design system, "PRs only", budget, deadline).
4. **Definition of done / verification** — how you will *prove* it works, decided now. "Build passes" is the floor, not the definition. Prefer observable behavior: "the badge appears on the article card and the tooltip shows on hover, verified in the browser". If you can't state how you'll verify a step, the step is not well-defined yet.

---

## Phase 4 — Decompose into steps

Principles for the step list:

1. **Each step leaves the project working.** Build passes, site renders, both language versions consistent. Never plan a sequence where the repo is broken between step 2 and step 5. If necessary, reorder or merge steps to preserve this.
2. **Order by dependency, then by risk.** Do the step most likely to invalidate the plan *first* (the uncertain integration, the API you've never used, the schema change). Discovering a blocker at step 1 costs nothing; at step 7 it costs the whole plan.
3. **Right altitude.** A step says *what* changes, *where*, and *why* — not full code. Include a code snippet only when the exact shape is the point (a schema, a frontmatter format, a tricky migration). Full code in plans goes stale and wastes context.
4. **Steps are checkable.** Someone must be able to look at the repo and answer "is step 3 done?" with yes/no. "Improve readability" is not a step; "raise body text contrast to ≥ 7:1 against the background in both themes" is.
5. **Size steps for one sitting.** If a step is bigger than roughly one focused work session (or one PR), split it. If several steps always travel together, merge them.
6. **Name the risks inline.** Where a step is uncertain, say so in the step: "Risk: Buttondown API may not support X → fallback: do Y." A plan that admits its uncertainties survives contact with reality; one that doesn't gets silently abandoned.
7. **Include the boring tail.** Update the roadmap/docs, update translations (both languages!), regenerate assets, update the skill if the workflow changed, verification step, PR. These forgotten steps are where "done" quietly becomes "80% done".

---

## Phase 5 — Write the plan down (format)

For anything beyond a small change, the plan lives in a **file in the repo** (e.g. `docs/plans/<topic>.md`), not only in the conversation. Reasons: it survives the context window, it can be executed by a different session or a cheaper model, and its checkboxes are shared state between sessions.

Template:

```markdown
# Plan: <title>

## Goal
<one sentence, user-visible outcome>

## Non-goals
- <thing we are explicitly not doing>

## Constraints & decisions already made
- <stack, conventions, prior user choices — with source (CLAUDE.md, user said on <date>, …)>

## Open questions
- [ ] <question> — recommended: <answer, why>   ← must be empty before execution starts

## Steps
- [ ] 1. <what, where, why> (files: `src/...`) — verify: <how>
- [ ] 2. … Risk: <risk> → fallback: <plan B>

## Verification (definition of done)
- [ ] <observable behavior 1>
- [ ] build passes, both languages consistent
- [ ] roadmap/docs updated

## Status log
- <date>: step 1–2 done (PR #NN). Deviation: <what changed vs plan and why>
```

Rules for the file:
- **Check boxes off as you go and append to the status log** in the same commit as the work. A plan whose state is stale is worse than no plan — the next session will redo or skip work.
- **Record deviations.** When execution diverges from the plan (it will), update the plan file, don't just diverge silently.
- One plan file per initiative. Delete or archive it when done (move to `docs/archive/`).

---

## Phase 6 — Execute against the plan

1. **One step at a time, verify each step** before moving on, using the verification you wrote in the plan — not an improvised weaker one.
2. **Re-read the relevant plan section before each step**, especially in a fresh session. Do not work from memory of the plan.
3. **When reality contradicts the plan, stop and replan the remainder** — don't force the broken step through. Small deviation: note it in the status log and continue. Structural deviation (an assumption from Phase 1 was wrong): go back to Phase 1 for the affected part, update the plan, then continue. Never keep executing steps whose premise has died.
4. **Scope discipline during execution**: if you notice something worth doing that's outside the plan, *write it down* (in the plan's status log or the ideas file) and keep going. Don't do it now.
5. **Session hygiene**: one feature (or one plan point) per session where possible. Start a new session by reading the plan file, not by re-deriving context. This is what makes the plan-file pattern pay off: the file, not the conversation, is the source of truth.
6. **Report honestly.** At the end of each step/session: what was done, what was verified (with evidence — command output, screenshot), what deviated, what's next. If a test fails or a step was skipped, say it plainly. Never present unverified work as done.

---

## Anti-patterns (the failure modes this method prevents)

- **Planning from imagination**: writing steps about files you never opened. → Phase 1.
- **Question dribbling**: asking one clarification per message across ten messages. → Phase 2, batch with recommendations.
- **The todo list disguised as a plan**: steps without goal, non-goals, or verification. → Phase 3.
- **Front-loading the easy parts**: doing five comfortable steps, then hitting the risky one and discovering the plan is invalid. → Phase 4, risk first.
- **The 80% plan**: no steps for docs, translations, roadmap update, verification. → Phase 4, boring tail.
- **The stale plan file**: checkboxes never updated, next session redoes step 1. → Phase 5, update in the same commit.
- **Silent divergence**: executing something different from the plan without recording it. → Phase 6.
- **Scope creep mid-execution**: "while I'm here…" → Phase 6, write it down instead.
- **Re-deciding decided things**: proposing a new stack/tool when one was already chosen. → Phase 0.
- **Fake verification**: "build passes" as the only proof for a UI change nobody looked at. → Phase 3, define observable verification up front.

---

## One-page cheat sheet (for the executing model)

1. Classify: question → answer only; small → just do it; feature → plan; initiative → plan file.
2. Read the real code, docs, and conventions first. Verify every assumption you'll rely on.
3. Ask all genuine user questions at once, each with a recommended answer. Never ask what the repo can answer.
4. Write: Goal (1 sentence) · Non-goals · Constraints · Definition of done.
5. Steps: dependency-ordered, riskiest first, each checkable, each leaves the build green, include docs/translations/verification/PR tail.
6. Put the plan in `docs/plans/`, with checkboxes and a status log.
7. Execute one step at a time; verify with the planned check; tick the box in the same commit.
8. Plan wrong? Stop, update the plan, then continue. Out-of-scope idea? Write it down, keep going.
9. Report what was done, what was verified, what deviated — honestly.
