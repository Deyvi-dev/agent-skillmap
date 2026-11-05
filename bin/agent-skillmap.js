#!/usr/bin/env node
// Zero-dependency installer: copies every agent-skillmap skill into a target project.
import { cpSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const pkgRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const skillsSrc = join(pkgRoot, "skills");
const args = process.argv.slice(2);
const cmd = args[0];
const flag = (name) => {
  const i = args.indexOf(name);
  return i !== -1 ? args[i + 1] : undefined;
};

if (cmd !== "init") {
  console.log(`Usage: agent-skillmap init [--dir <path>] [--force]

Copies every skill into <path>/<skill> (default: .claude/skills).
Then run /radioactive <task> or /agent-skillmap in your agent.`);
  process.exit(cmd ? 1 : 0);
}

const cwd = process.cwd();
const target = resolve(cwd, flag("--dir") ?? ".claude/skills");
if (target !== cwd && !target.startsWith(cwd + sep)) {
  console.error("Refusing to write outside the current directory.");
  process.exit(1);
}

const names = readdirSync(skillsSrc, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name);
const existing = names.filter((n) => existsSync(join(target, n)));
if (existing.length && !args.includes("--force")) {
  console.error(`Already installed: ${existing.join(", ")}. Use --force to overwrite.`);
  process.exit(1);
}

mkdirSync(target, { recursive: true });
for (const n of names) cpSync(join(skillsSrc, n), join(target, n), { recursive: true });
console.log(`Installed ${names.length} skills into ${target}\nTry: /radioactive <task>`);
