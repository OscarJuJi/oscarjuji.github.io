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
  { query: "python", expect: [1, 2, 3, 4, 6, 7, 8, 9, 14, 17], why: "matches the Python tag" },
  { query: "PYTHON", expect: [1, 2, 3, 4, 6, 7, 8, 9, 14, 17], why: "case-insensitive" },
  { query: "pyt", expect: [1, 2, 3, 4, 6, 7, 8, 9, 14, 17], why: "prefix match while typing" },
  { query: "matlab", expect: [11, 15], why: "contour GUI + CV labs" },
  { query: "sql", expect: [10], why: "tag + description match" },
  { query: "node", expect: [10], why: "part of the Node.js tag" },
  { query: "nodejs", expect: [10], why: "squashed form of Node.js" },
  { query: "u-net", expect: [3], why: "punctuated tag kept intact" },
  { query: "unet", expect: [3], why: "squashed form of U-Net" },
  { query: "net", expect: [3, 17], why: "U-Net / neural networks — NOT 'geNETic' (old bug)" },
  { query: "rag", expect: [2, 4], why: "RAG from scratch + RAG ChatBot — word start only" },
  { query: "ai", expect: [1, 3, 5, 6, 8, 13, 14, 17], why: "word start only — no mid-word 'ai' hits" },
  { query: "react", expect: [5], why: "only the portfolio website tags React" },
  { query: "c++", expect: [12], why: "'+' preserved in tokens" },
  { query: "numpy", expect: [2, 7], why: "new from-scratch NumPy projects" },
  { query: "trading", expect: [1], why: "new LLM paper-trading agent" },
  { query: "svg", expect: [7], why: "new Image-to-SVG vectorizer" },
  { query: "spotify", expect: [9], why: "new Spotify->YT Music migrator" },
  { query: "oauth", expect: [9], why: "migrator's OAuth tag" },
  { query: "llm", expect: [1, 4], why: "LLM agent + RAG ChatBot LLM tag" },
  { query: "transformers", expect: [2, 5], why: "RAG-from-scratch tag + Transformers.js" },
  { query: "gamification", expect: [6], why: "Code Pets' own tag" },
  { query: "data structures", expect: [16, 17], why: "new C repo + ESCOM repository" },
  { query: "python sudoku", expect: [8, 14], why: "both genetic sudoku projects (AND semantics)" },
  { query: "computer vision", expect: [3, 7, 11, 15, 17], why: "phrase across tags/titles/descriptions" },
  { query: "deep learning", expect: [2, 17], why: "RAG-from-scratch + ESCOM repo" },
  { query: "stable diffusion", expect: [3], why: "two-word tag" },
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
  console.log(`${pass ? "PASS" : "FAIL"}  ${label.padEnd(18)} -> ${fmt(got).padEnd(30)}${result}  ${why}`);
}

console.log("");
console.log(`${CASES.length - failed}/${CASES.length} tests passed`);
if (failed > 0) process.exitCode = 1;
