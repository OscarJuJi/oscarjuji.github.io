/**
 * Test cases for the portfolio project filter.
 * Run with: npm run test:filter
 */
import { projectList, projectMatches } from "../src/portfolio-search.mjs";

// Returns the 1-based numbers of the projects a query matches.
const run = (query) =>
  projectList
    .map((project, i) => ({ project, num: i + 1 }))
    .filter(({ project }) => projectMatches(project, query))
    .map(({ num }) => num);

const ALL = projectList.map((_, i) => i + 1);

const CASES = [
  { query: "", expect: ALL, why: "empty query shows all projects" },
  { query: "   ", expect: ALL, why: "whitespace-only query shows all projects" },
  { query: "python", expect: [1, 2, 3, 11], why: "matches the Python tag" },
  { query: "PYTHON", expect: [1, 2, 3, 11], why: "case-insensitive" },
  { query: "pyt", expect: [1, 2, 3, 11], why: "prefix match while typing" },
  { query: "matlab", expect: [7, 10], why: "contour GUI + CV labs" },
  { query: "sql", expect: [6], why: "tag + description match" },
  { query: "node", expect: [6], why: "part of the Node.js tag" },
  { query: "nodejs", expect: [6], why: "squashed form of Node.js" },
  { query: "u-net", expect: [1], why: "punctuated tag kept intact" },
  { query: "unet", expect: [1], why: "squashed form of U-Net" },
  { query: "net", expect: [1, 11], why: "U-Net / neural networks — NOT 'geNETic' (old bug)" },
  { query: "rag", expect: [2], why: "word start only — NOT 'stoRAGe' (old bug)" },
  { query: "ai", expect: [1, 3, 5, 9, 11], why: "word start only — no mid-word 'ai' hits" },
  { query: "react", expect: [4, 5], why: "SG_event + portfolio website" },
  { query: "c++", expect: [8], why: "'+' preserved in tokens" },
  { query: "python sudoku", expect: [3], why: "multi-word = AND (old bug: showed every Python project)" },
  { query: "computer vision", expect: [1, 7, 10, 11], why: "phrase found across tags, titles, descriptions" },
  { query: "deep learning", expect: [11], why: "two-word tag" },
  { query: "stable diffusion", expect: [1], why: "two-word tag" },
  { query: "blockchain", expect: [], why: "no match -> empty-state message" },
];

console.log("Project legend:");
projectList.forEach((p, i) => console.log(`  P${i + 1}  ${p.title}`));
console.log("");

const fmt = (nums) => (nums.length ? nums.map((n) => `P${n}`).join(",") : "(none)");

let failed = 0;
for (const { query, expect, why } of CASES) {
  const got = run(query);
  const pass = got.length === expect.length && got.every((n, i) => n === expect[i]);
  if (!pass) failed++;
  const label = query.trim() === "" ? (query === "" ? "(empty)" : "(spaces)") : `"${query}"`;
  const result = pass ? "" : ` [expected ${fmt(expect)}]`;
  console.log(`${pass ? "PASS" : "FAIL"}  ${label.padEnd(20)} -> ${fmt(got).padEnd(22)}${result}  ${why}`);
}

console.log("");
console.log(`${CASES.length - failed}/${CASES.length} tests passed`);
if (failed > 0) process.exitCode = 1;
