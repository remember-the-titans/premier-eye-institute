/* Build the static export with the GitHub Pages base path and force-push
   out/ as a fresh single-commit gh-pages branch. Run: npm run deploy:pages
   (A CI workflow would be nicer, but pushing workflow files needs the
   `workflow` OAuth scope — run `gh auth refresh -s workflow` first if you
   ever want to switch to Actions.) */

import { execSync } from "node:child_process";
import { writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "out");
const run = (cmd, cwd = process.cwd()) =>
  execSync(cmd, {
    stdio: "inherit",
    cwd,
    env: { ...process.env, NEXT_PUBLIC_BASE_PATH: "/premier-eye-institute" },
  });

run("npx next build");
// Pages runs Jekyll on branch deploys, which drops _next/ (underscore
// dirs) — .nojekyll turns that off.
writeFileSync(join(OUT, ".nojekyll"), "");

// Publish out/ as its own throwaway repo so the branch only ever contains
// the export — no history, no stray root files.
rmSync(join(OUT, ".git"), { recursive: true, force: true });
run("git init -b gh-pages", OUT);
run("git add -A", OUT);
run('git commit -m "Deploy static export"', OUT);
run(
  "git push -f https://github.com/remember-the-titans/premier-eye-institute.git gh-pages",
  OUT
);
rmSync(join(OUT, ".git"), { recursive: true, force: true });

console.log(
  "\nDeployed. Live in ~a minute at https://remember-the-titans.github.io/premier-eye-institute/"
);
