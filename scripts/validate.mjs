#!/usr/bin/env node
// Zero-dependency checks run in CI and before every `npm publish`.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const skillsDir = join(root, "skills");
const errors = [];
const fail = (msg) => errors.push(msg);

const walk = (d) =>
  readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.name === ".git" || e.name === "node_modules" ? [] : e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]);

// 1. No root SKILL.md: `npx skills add` stops there and installs a single skill.
if (existsSync(join(root, "SKILL.md"))) fail("Root SKILL.md found: move it to skills/<name>/SKILL.md");

// 2. Every skill: folder == name, required frontmatter fields, one-line values.
const RESERVED = new Set(["review", "init", "help", "clear", "config", "login", "logout", "doctor", "memory", "model"]);
const skills = readdirSync(skillsDir).filter((n) => statSync(join(skillsDir, n)).isDirectory());
for (const name of skills) {
  const file = join(skillsDir, name, "SKILL.md");
  if (!existsSync(file)) { fail(`skills/${name}: missing SKILL.md`); continue; }
  const fm = readFileSync(file, "utf8").match(/^---\n([\s\S]*?)\n---\n/);
  if (!fm) { fail(`skills/${name}: missing frontmatter`); continue; }
  const field = (k) => fm[1].match(new RegExp(`^${k}:\\s*(.*)$`, "m"))?.[1]?.trim();
  if (field("name") !== name) fail(`skills/${name}: frontmatter name "${field("name")}" must equal folder name`);
  if (!field("description")) fail(`skills/${name}: missing description`);
  if (!field("argument-hint")) fail(`skills/${name}: missing argument-hint`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) fail(`skills/${name}: name must be lowercase-hyphenated`);
  if (RESERVED.has(name)) fail(`skills/${name}: clashes with a built-in agent command`);
}

// 3. Relative links between skills must resolve.
for (const file of walk(skillsDir).filter((f) => f.endsWith(".md"))) {
  const text = readFileSync(file, "utf8");
  for (const m of text.matchAll(/(?:`|\]\()(\.\.?\/[^)`\s]+\.md)/g)) {
    if (!existsSync(resolve(dirname(file), m[1]))) fail(`${relative(root, file)}: broken link ${m[1]}`);
  }
}

// 4. html-manual is permanently removed: no workflow, no references, no .html files shipped.
for (const file of walk(root)) {
  const rel = relative(root, file);
  if (rel === "scripts/validate.mjs") continue;
  if (/\.html?$/i.test(rel)) fail(`${rel}: HTML files are not allowed (docs are Markdown only)`);
  if (/html-manual/i.test(rel)) fail(`${rel}: html-manual is not allowed`);
  if (/\.(md|json|js|mjs|ya?ml)$/.test(rel) && /html-manual/i.test(readFileSync(file, "utf8")))
    fail(`${rel}: references html-manual`);
}

if (errors.length) {
  console.error(`✗ ${errors.length} problem(s):\n  - ${errors.join("\n  - ")}`);
  process.exit(1);
}
console.log(`✓ ${skills.length} skills valid`);
