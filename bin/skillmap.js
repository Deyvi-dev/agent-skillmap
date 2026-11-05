#!/usr/bin/env node
// Zero-dependency installer: copies the skillmap skill into a target project.
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const pkgRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const cmd = args[0];
const flag = (name) => {
  const i = args.indexOf(name);
  return i !== -1 ? args[i + 1] : undefined;
};

if (cmd !== "init") {
  console.log(`Usage: skillmap init [--dir <path>] [--force]

Copies the skillmap skill into <path> (default: .claude/skills/skillmap).
Then ask your agent: "skillmap this project."`);
  process.exit(cmd ? 1 : 0);
}

const target = resolve(process.cwd(), flag("--dir") ?? ".claude/skills/skillmap");
if (target !== process.cwd() && !target.startsWith(process.cwd() + sep)) {
  console.error("Refusing to write outside the current directory.");
  process.exit(1);
}
if (existsSync(target) && !args.includes("--force")) {
  console.error(`${target} already exists. Use --force to overwrite.`);
  process.exit(1);
}

mkdirSync(target, { recursive: true });
for (const entry of ["SKILL.md", "workflows", "runbooks"]) {
  cpSync(join(pkgRoot, entry), join(target, entry), { recursive: true });
}
console.log(`Installed skillmap skill at ${target}\nNow ask your agent: "skillmap this project."`);
