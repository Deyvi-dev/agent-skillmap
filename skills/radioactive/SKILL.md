---
name: radioactive
description: Full-cycle 11-phase feature workflow (discover, plan, execute, test, review, fix, changelog) that runs directly in any project with no setup.
argument-hint: "<feature or task description>"
---

## agent-skillmap.workflow.radioactive

### Goal

Provide a portable, end-to-end 11-phase development lifecycle workflow that enforces strict quality gates from initial problem discovery to final review, fix iteration, institutional memory update, and changelog generation.

---

### Scope

- **Applies to**: Non-trivial features, architectural refactors, or cross-layer implementations (e.g. backend + API + frontend) across any project or tech stack.
- **Does not cover**: Single-file trivial bug fixes, pure documentation edits (use `document`), or isolated test additions.

---

### Triggers

- "Run radioactive lifecycle"
- "/radioactive [feature description]"
- "Full-cycle feature development"
- "Implement feature with end-to-end quality gate"

---

### Inputs

- `featureDescription`: The text typed after the command (`/radioactive <task>` → `$ARGUMENTS`). Short text describing the feature or task (optional; if missing, triggers Phase 2 discovery).
- `projectSlug`: Short identifier for the repo (e.g., `apix`, `my-backend`).
- `baseBranch`: Target integration branch (default: `main` or `develop`).
- `techStack`: Stack details (e.g., `Ruby on Rails + PostgreSQL`, `Next.js + TypeScript`).
- `existingRootDoc`: Main instruction file (`AGENTS.md`, `CLAUDE.md`, etc.).
- `uiInvolved`: Boolean flag indicating if frontend/UI changes are required.
- `maxFixAttempts`: Maximum iterations for the Phase 9 fix loop (default: 3).

---

### Invariants (Guardrails)

1. **Sequential Phase Pipeline**: All 11 phases must execute in exact numerical order. No phase skipping.
2. **Zero setup, standalone command**: `/radioactive <task>` runs as-is in any repository.
   - Read whatever project context already exists (`AGENTS.md`, `CLAUDE.md`, `README.md`, and `skills/<projectSlug>/SKILL.md` if present) and enforce its rules.
   - If none exists, derive stack, conventions and rules from the code itself (package manifests, schema, existing modules) and continue.
   - **Never** scaffold a project skill, router, `template.json`, routing matrix, or `.claude/skills/<project>` shim as a prerequisite, and never redirect the user to `/<project> radioactive`. Run `/agent-skillmap` only if the user explicitly asks for it.
3. **Socratic Discovery Gate**: Phase 2 must present discovery questions and wait for explicit user response/confirmation before Phase 3/4.
4. **Plan Approval Gate**: Phase 4 must generate a structured task breakdown at `docs/tasks/task.<reference>.md` and obtain explicit user approval before Phase 5.
5. **Executable Workflow Contract**: Phase 5 must scaffold a reusable workflow contract at `skills/<projectSlug>/workflows/<feature-slug>/SKILL.md`.
6. **Pass/Fail Quality Gate**: Phase 7 specs must pass 100%. Phase 9 fix loop must resolve all 🔴 (Blockers) and 🟠 (High) findings before declaration of completion.
7. **Institutional Memory**: Phase 10 must capture newly discovered patterns into workflow contracts and update project documentation.
8. **Operational Safety for Infra Tasks**: When the feature affects network, infrastructure, IaC, or OS baselines, execution must include explicit rollback, change window alignment, and post-change health validation.
9. **Markdown only — never generate HTML manuals**: documentation, manuals and diagrams are written as Markdown (Mermaid for diagrams). Do not create `.html` manuals, HTML documentation sites or any HTML manual workflow, even when asked to "make a manual".

---

### Procedure

```
Phase 1  — CLASSIFY         → Read existing project rules (no scaffolding)
Phase 2  — DISCOVER         → /brainstorming (Socratic questions & decision log)
Phase 3  — UX DESIGN        → /ui-ux-pro-max or frontend-design (if UI involved)
Phase 4  — PLAN             → /plan-writing (structured task breakdown in docs/tasks/task.<reference>.md)
Phase 5  — CONTRACT         → Optional: feature contract only if the project already uses skills/<projectSlug>/
Phase 6  — EXECUTE          → Implement tasks sequentially with evidence-based edits
Phase 7  — TESTS            → Project test runner (specs/tests for all changed code)
Phase 8  — REVIEW           → /thermo-nuclear-code-quality-review or /doc-review
Phase 9  — FIX LOOP         → /thermo-fix × up to 3 (resolve 🔴→🟠→🟡, verify build, re-review)
Phase 10 — LEARNINGS        → Record new rules in AGENTS.md / existing project skill
Phase 11 — CHANGELOG        → /changelog-generator or /changelog (user-facing release note)
```

#### Phase 1 — CLASSIFY

1. Read the project context that already exists: `AGENTS.md` / `CLAUDE.md`, `README.md`, and `skills/<projectSlug>/SKILL.md` (with its routing matrix) only if it is present.
2. If there is no written project context, infer `techStack`, conventions (ID format, ORM, test runner, folder layout) and hard rules from the code. Do not create files for this.
3. Output a 1-paragraph context summary: stack, rules that apply, and the modules the task touches.

#### Phase 2 — DISCOVER with /brainstorming

1. Load `brainstorming` skill (or run Socratic discovery protocol).
2. Ask 3–5 strategic questions covering scope boundaries, data models, security surface, integration points, and edge cases.
3. **Wait for user response.** Do NOT proceed to Phase 3/4 until questions are answered or user explicitly approves.
4. Summarize into a **decision log** appended to conversation context.

#### Phase 3 — UX DESIGN (Conditional)

1. **Check condition**: Run only if `uiInvolved` is true (or feature touches views, templates, or visual components).
2. Load UI design skill (`ui-ux-pro-max` or `frontend-design`).
3. Generate design tokens (color palette, CSS variables, typography) and responsive layout rules (using mobile-first `min-*` breakpoints).
4. Append UX design rules to the decision log.

#### Phase 4 — PLAN with /plan-writing

1. Load `plan-writing` skill (or task planning methodology).
2. Produce a structured task specification at `docs/tasks/task.<reference>.md` containing context, tasks with file targets, explicit dependencies, and verification criteria.
3. Present plan to user and **gate on explicit approval**.

#### Phase 5 — CONTRACT (optional)

1. **Skip this phase** unless the project already has `skills/<projectSlug>/` or the user asked for a reusable contract. The approved `docs/tasks/task.<reference>.md` is the contract.
2. When it applies: save the contract at `skills/<projectSlug>/workflows/<feature-slug>/SKILL.md` and add it to the existing routing matrix.

#### Phase 6 — EXECUTE

1. Execute tasks in `docs/tasks/task.<reference>.md` sequentially.
2. Read files before editing; apply minimal, targeted edits.
3. Track progress by marking `[/]` (in progress) and `[x]` (completed) in `docs/tasks/task.<reference>.md`.
4. For infra-impacting tasks, execute pre-change checks and capture rollback checkpoints before mutating state.

#### Phase 7 — TESTS

1. Run the project's test runner (e.g. `rspec-rails`, `vitest`, `pytest`, or `testing-patterns`).
2. Write unit/integration/system tests for all newly created or modified logic.
3. Iterate until 100% of specs pass.
4. For operational tasks, run infrastructure checks (connectivity, policy checks, service health, drift validation) and archive outputs.

#### Phase 8 — REVIEW with Code Quality Engine

1. Run code review (`thermo-nuclear-code-quality-review` or `doc-review` skill) against all files modified in the session.
2. Output a severity-ranked findings table:
   - 🔴 **Blocker**: Must fix before release.
   - 🟠 **High**: Fix in current cycle.
   - 🟡 **Medium**: Fix if trivial or record.
   - 🟢 **Low**: Informational.
3. Append findings table to `walkthrough.md` artifact.

#### Phase 9 — FIX LOOP (up to `maxFixAttempts` ×)

1. Iterate up to `maxFixAttempts` times:
   - Apply fixes for 🔴 Blocker and 🟠 High findings.
   - Run build verification command (`bun run build`, `rails runner`, `npm run test`, etc.).
   - Re-review modified files.
   - Stop loop early if zero 🔴 / 🟠 findings remain (verdict: APPROVED).
2. Update `docs/tasks/task.<reference>.md` and `walkthrough.md` with final verdict.
3. Create a clean git commit on the local working branch.

#### Phase 10 — LEARNINGS

1. Review discoveries made during execution.
2. If a durable project rule was discovered, add it to `AGENTS.md` (or the existing project skill). Keep it to a few lines.
3. Do not create new skills, routers or manifests here unless the user asks.

#### Phase 11 — CHANGELOG Generation

1. Load `changelog-generator` (or `changelog` skill).
2. Analyze session git commits against base branch.
3. Generate customer-facing release notes categorized by Features, Fixes, and Improvements.
4. Append changelog entry to `walkthrough.md`.

---

### Outputs

- `docs/tasks/task.<reference>.md`: Executed task breakdown with completion status.
- `walkthrough.md`: Decision log, UX specs, review tables, fix history, and user changelog.
- Optional: `skills/<projectSlug>/workflows/<feature-slug>/SKILL.md` (only if the project already uses project skills).
- New durable rules added to `AGENTS.md` (when any were discovered).
- Clean git commit on local branch.

---

### Review gate

- [ ] Phase 1 project context read (no scaffolding created).
- [ ] Phase 2 discovery questions answered by user.
- [ ] Phase 3 UX design system generated (if UI feature).
- [ ] Phase 4 plan approved by user.
- [ ] Phase 5 skipped, or contract added to the existing project skill.
- [ ] Phase 6 execution complete.
- [ ] Phase 7 all test suites passing.
- [ ] Phase 9 zero Blocker or High findings remaining.
- [ ] Phase 10 durable learnings recorded (or none found).
- [ ] Phase 11 user-facing changelog generated.

---

### References

- `../agent-skillmap/SKILL.md`
- `../plan-to-skillmap/SKILL.md`
- `../doc-review/SKILL.md`
- `../changelog/SKILL.md`
