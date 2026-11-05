# Contributing to agent-skillmap (agent instructions)

- Every skill lives in `skills/<name>/SKILL.md`. The folder name must equal the
  frontmatter `name`, which is also the slash command (`/<name>`).
- Frontmatter needs `name`, `description` and `argument-hint`. Keep descriptions
  one sentence so autocomplete stays readable.
- Never add a `SKILL.md` at the repository root: `npx skills add` stops there and
  installs only that one skill.
- Link sibling skills with `../<name>/SKILL.md` so links still resolve after install.
- Avoid names that clash with built-in agent commands (e.g. `review`, `init`).
- The entry skill is `skills/agent-skillmap/SKILL.md`; runbooks live next to it.
