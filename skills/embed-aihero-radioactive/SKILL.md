---
name: embed-aihero-radioactive
description: 14-phase radioactive variant with the AI Hero skills (wayfinder, grilling, domain-modeling, research, prototype, to-spec) that runs directly in any project with no setup.
argument-hint: "<feature or task description>"
---

## agent-skillmap.workflow.embed-aihero-radioactive

### Goal

Run a 14-phase development lifecycle that embeds Matt Pocock's skills (`wayfinder`, `grilling`, `domain-modeling`, `research`, `prototype`, `to-spec`) directly from `/embed-aihero-radioactive <task>`, reading the project's existing rules first. It uses the installed sibling skills; nothing is copied into the project.

---

### Scope

- **Applies to**: Executing complex features, domain-driven refactors, or cross-stack implementations requiring deep discovery, domain modeling, and quality-gated delivery.
- **Does not cover**: Single-file trivial bug fixes, pure documentation edits (use `document`), or isolated test additions.

---

### Triggers

- "Run embed-aihero-radioactive lifecycle"
- "/embed-aihero-radioactive [feature description]"
- "Adapt radioactive workflow with Matt Pocock skills"

---

### Inputs

- `featureDescription`: Short text describing the feature or task (optional; if missing, triggers Phase 1 discovery).
- `projectSlug`: Short identifier for the repo (e.g., `my-backend`, `apix`).
- `baseBranch`: Target integration branch (default: `main` or `develop`).
- `techStack`: Core stack details (e.g., `NestJS + MikroORM + PostgreSQL`, `Rails + React`).
- `existingRootDoc`: Main instruction file (`AGENTS.md`, `CLAUDE.md`, etc.).
- `uiInvolved`: Boolean flag indicating if frontend/UI changes are required.
- `needsPrototype`: Boolean flag indicating if a proof-of-concept prototype spike is required.
- `maxFixAttempts`: Maximum iterations for the Phase 12 fix loop (default: 3).

---

### Invariants (Guardrails)

1. **Zero setup, standalone command**: Phase 1 reads the project's existing rules (`AGENTS.md`, `CLAUDE.md`, `README.md`, `skills/<projectSlug>/SKILL.md` if present) FIRST, then runs `/wayfinder`. **Never** scaffold a project skill, router, `template.json`, `.claude/skills/<project>` shim or copies of the AI Hero skills as a prerequisite, and never redirect the user to `/<project> radioactive`.
2. **Sequential Phase Pipeline**: All 14 phases must execute in exact numerical order. No phase skipping.
3. **Follow the project's ID convention**: New entities use the identifier format the project already uses (e.g. UUIDv4, serial). Propose UUIDv7 only when there is no convention yet, and record the choice in the decision log.
4. **Socratic Grilling Gate**: Phase 2 must present grilling questions and wait for explicit user response/confirmation before Phase 3 domain modeling.
5. **Spec Approval Gate**: Phase 7 must generate a structured task specification at `docs/tasks/task.<reference>.md` and obtain explicit user approval before Phase 8/9 execution.
6. **Executable Workflow Contract**: Phase 8 must scaffold a reusable workflow contract at `skills/<projectSlug>/workflows/<feature-slug>/SKILL.md`.
7. **Pass/Fail Quality Gate**: Phase 10 specs must pass 100%. Phase 12 fix loop must resolve all 🔴 (Blockers) and 🟠 (High) findings before declaration of completion.
8. **Institutional Memory**: Phase 13 must capture newly discovered patterns into workflow contracts and update project documentation.
9. **Operational Safety for Infra Tasks**: When the feature affects network, infrastructure, IaC, or OS baselines, execution must include explicit rollback, change window alignment, and post-change health validation.

### Task files

- `<reference>` = `YYYY-MM-DD-<task-slug>` (today's date + 2–4 word kebab-case slug, e.g. `2026-11-05-evolution-go`). Pick it once in Phase 1, state it to the user, and reuse it for the whole run. If `docs/tasks/` already has a reference for the same task, continue that one instead of creating a new one.
- Spec / plan: `docs/tasks/task.<reference>.md`.
- Every other artifact of the run (walkthrough, decision-log, wayfinder, domain-model, research-spike, prototype-report): `docs/tasks/<reference>/`. Never write them at the repository root.
- Disposable spike code goes in `scratch/` (add it to `.gitignore` if missing).

---

### Procedure

```
Phase 1  — CLASSIFY & WAYFIND  → Existing project rules FIRST ➔ /wayfinder
Phase 2  — GRILLING            → /grilling (Deep Socratic interrogation & decision log)
Phase 3  — DOMAIN MODELING     → /domain-modeling (Entities, keys, state machines)
Phase 4  — TECHNICAL RESEARCH  → /research (Technical spikes, dependency & API investigation)
Phase 5  — PROTOTYPE / SPIKE   → /prototype (Conditional: POC validation for high-risk logic)
Phase 6  — UX DESIGN           → /ui-ux-pro-max (Conditional: if UI involved)
Phase 7  — TO-SPEC             → /to-spec (Synthesize findings into docs/tasks/task.<reference>.md)
Phase 8  — WORKFLOW CONTRACT  → Optional: only if the project already uses skills/<projectSlug>/
Phase 9  — EXECUTE             → Implement tasks sequentially with evidence-based edits
Phase 10 — TESTS               → Run project specs/tests (100% pass required)
Phase 11 — REVIEW              → /thermo-nuclear-code-quality-review or /doc-review
Phase 12 — FIX LOOP            → /thermo-fix × up to 3 (resolve 🔴→🟠, re-verify build)
Phase 13 — LEARNINGS           → Record new rules in AGENTS.md / existing project skill
Phase 14 — CHANGELOG           → /changelog-generator or /changelog (Release notes)
```

#### Phase 1 — CLASSIFY & WAYFIND (Project rules ➔ /wayfinder)

1. **Step 1: Read existing project rules**:
   - Read `AGENTS.md` / `CLAUDE.md`, `README.md`, and `skills/<projectSlug>/SKILL.md` (with its routing matrix) only if present.
   - Extract hard constraints, tech stack and conventions (ID format, ORM, test runner). If nothing is written down, infer them from the code. Do not create files for this.
   - **Route check**: if the routing matrix (or the task itself) points to a lighter target — a trivial fix, docs-only change or a dedicated project workflow — say so in one line and switch to it instead of running the 14 phases.
2. **Step 2: Codebase Orientation with `/wayfinder`**:
   - Load the installed `wayfinder` skill (`../wayfinder/SKILL.md`).
   - Map codebase entry points, data flows, route handlers, models, and subsystem boundaries relevant to the classified request.
   - Search repository for relevant controllers, schemas, database models, background jobs, and existing test coverage.
   - Identify existing architectural patterns, legacy constraints, and critical unknowns to feed Phase 2 grilling.
3. Choose the `<reference>` (see Task files) and create `docs/tasks/<reference>/`.
4. Output a 1-paragraph context summary (including the `<reference>`) combining the primary project skill rules and the `docs/tasks/<reference>/wayfinder.md` orientation brief.

#### Phase 2 — GRILLING with /grilling

1. Load `grilling` skill and parse the `docs/tasks/<reference>/wayfinder.md` brief and project rules.
2. Formulate 3 to 7 strategic questions covering Scope, Edge Cases, Data Contracts (identifier format), and Performance/Security rules.
3. Present questions with trade-offs (Pros, Cons, Recommended Default).
4. **Wait for explicit user response.** Do NOT proceed until user answers are recorded into a binding **Decision Log** (`docs/tasks/<reference>/decision-log.md`).

#### Phase 3 — DOMAIN MODELING with /domain-modeling

1. Load `domain-modeling` skill and review `docs/tasks/<reference>/decision-log.md`.
2. Define Aggregate Roots, Entities, Value Objects, and field types.
3. Use the project's existing primary-key convention for new models (UUIDv7 only if there is none).
4. Model state transitions (using Mermaid `stateDiagram-v2`) and entity relationships (using Mermaid `erDiagram`).
5. Output `docs/tasks/<reference>/domain-model.md`.

#### Phase 4 — TECHNICAL RESEARCH with /research

1. Load `research` skill to address technical unknowns or API contract dependencies.
2. Execute temporary spikes in `scratch/` directory to measure performance or test library behavior.
3. Evaluate third-party dependencies, security surface, and API constraints.
4. Output `docs/tasks/<reference>/research-spike.md`.

#### Phase 5 — PROTOTYPE / SPIKE with /prototype (Conditional)

1. **Check condition**: Run if `needsPrototype` is true or if high-risk UI/algorithmic logic was identified.
2. Load `prototype` skill to build a lightweight proof-of-concept (POC) spike.
3. Perform interactive smoke tests or screenshot verification to test core hypotheses.
4. Record retrospective learnings in `docs/tasks/<reference>/prototype-report.md`.

#### Phase 6 — UX DESIGN with /ui-ux-pro-max (Conditional)

1. **Check condition**: Run if `uiInvolved` is true (or feature touches views, templates, or visual components).
2. Load `ui-ux-pro-max` skill.
3. Generate design tokens (color palette, CSS variables, typography) and responsive layout rules (using mobile-first `min-*` breakpoints).
4. Append UX design rules to `docs/tasks/<reference>/walkthrough.md`.

#### Phase 7 — TO-SPEC with /to-spec

1. Load `to-spec` skill and consolidate all upstream evidence (`docs/tasks/<reference>/wayfinder.md`, `docs/tasks/<reference>/decision-log.md`, `docs/tasks/<reference>/domain-model.md`, `docs/tasks/<reference>/research-spike.md`, `docs/tasks/<reference>/prototype-report.md`).
2. Produce a structured task specification at `docs/tasks/task.<reference>.md` featuring executive context, domain models, numbered task steps with target file paths, verification commands, and rollback playbooks.
3. Present `docs/tasks/task.<reference>.md` to user and **gate on explicit user approval**.

#### Phase 8 — WORKFLOW CONTRACT (optional)

1. **Skip this phase** unless the project already has `skills/<projectSlug>/` or the user asked for a reusable contract. The approved `docs/tasks/task.<reference>.md` is the contract.
2. When it applies: save it at `skills/<projectSlug>/workflows/<feature-slug>/SKILL.md` and add it to the existing routing matrix.

#### Phase 9 — EXECUTE

1. Execute tasks in `docs/tasks/task.<reference>.md` sequentially.
2. Read files before editing; apply minimal, targeted edits.
3. Track progress by marking `[/]` (in progress) and `[x]` (completed) in `docs/tasks/task.<reference>.md`.
4. For infra-impacting tasks, execute pre-change checks and capture rollback checkpoints before mutating state.

#### Phase 10 — TESTS

1. Run project test runner (e.g. `npm run test`, `rspec-rails`, `vitest`, `pytest`).
2. Write unit/integration/system tests for all newly created or modified logic.
3. Iterate until 100% of specs pass.
4. For operational tasks, run infrastructure checks (connectivity, policy checks, service health, drift validation) and archive outputs.

#### Phase 11 — REVIEW with Code Quality Engine

1. Run code review (`thermo-nuclear-code-quality-review` or `doc-review` skill) against all files modified in the session.
2. Output a severity-ranked findings table:
   - 🔴 **Blocker**: Must fix before release.
   - 🟠 **High**: Fix in current cycle.
   - 🟡 **Medium**: Fix if trivial or record.
   - 🟢 **Low**: Informational.
3. Append findings table to `docs/tasks/<reference>/walkthrough.md` artifact.

#### Phase 12 — FIX LOOP (up to `maxFixAttempts` ×)

1. Iterate up to `maxFixAttempts` times:
   - Apply fixes for 🔴 Blocker and 🟠 High findings (`thermo-fix`).
   - Run build verification command (`bun run build`, `npm run test`, etc.).
   - Re-review modified files.
   - Stop loop early if zero 🔴 / 🟠 findings remain (verdict: APPROVED).
2. Update `docs/tasks/task.<reference>.md` and `docs/tasks/<reference>/walkthrough.md` with final verdict.
3. Create a clean git commit on the local working branch.

#### Phase 13 — LEARNINGS

1. Review discoveries made during execution.
2. If a durable project rule was discovered, add it to `AGENTS.md` (or the existing project skill). Keep it to a few lines.
3. Do not create new skills, routers or manifests here unless the user asks.

#### Phase 14 — CHANGELOG Generation

1. Load `changelog-generator` (or `changelog` skill).
2. Analyze session git commits against base branch.
3. Generate customer-facing release notes categorized by Features, Fixes, and Improvements.
4. Append changelog entry to `docs/tasks/<reference>/walkthrough.md`.

---

### Outputs

- `docs/tasks/<reference>/wayfinder.md`: Orientation brief.
- `docs/tasks/<reference>/decision-log.md`: Grilling decision log.
- `docs/tasks/<reference>/domain-model.md`: Domain entity & state machine specification .
- `docs/tasks/<reference>/research-spike.md` / `docs/tasks/<reference>/prototype-report.md` (when triggered).
- `docs/tasks/task.<reference>.md`: Approved execution plan.
- `docs/tasks/<reference>/walkthrough.md`: Decision log, UX specs, review tables, fix history, and user changelog.
- Clean git commit on local branch.

---

### Review gate

- [ ] Existing project rules read FIRST in Phase 1 before running `/wayfinder` (no scaffolding created).
- [ ] Phase 1 Wayfinder orientation brief (`docs/tasks/<reference>/wayfinder.md`) created.
- [ ] Phase 2 Socratic grilling questions answered by user and recorded in `docs/tasks/<reference>/decision-log.md`.
- [ ] Phase 3 Domain model defined with the project's key convention and Mermaid state/ER diagrams.
- [ ] Phase 4 Technical research spike completed (if technical risks existed).
- [ ] Phase 5 Prototype POC validated (if prototype requested).
- [ ] Phase 6 UX design system generated (if UI feature).
- [ ] Phase 7 Technical specification (`docs/tasks/task.<reference>.md`) approved by user.
- [ ] Phase 8 skipped, or contract added to the existing project skill.
- [ ] Phase 9 Sequential execution complete.
- [ ] Phase 10 All test suites passing 100%.
- [ ] Phase 12 Zero Blocker (🔴) or High (🟠) findings remaining.
- [ ] Phase 13 durable learnings recorded (or none found).
- [ ] Phase 14 User-facing changelog generated.

---

### References

- `../agent-skillmap/SKILL.md`
- `../wayfinder/SKILL.md`
- `../grilling/SKILL.md`
- `../domain-modeling/SKILL.md`
- `../research/SKILL.md`
- `../prototype/SKILL.md`
- `../to-spec/SKILL.md`
- `../radioactive/SKILL.md`
