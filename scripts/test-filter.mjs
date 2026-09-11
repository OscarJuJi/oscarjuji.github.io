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
  { query: "python", expect: [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 17, 20], why: "matches the Python tag" },
  { query: "PYTHON", expect: [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 17, 20], why: "case-insensitive" },
  { query: "pyt", expect: [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 17, 20], why: "prefix match while typing" },
  { query: "matlab", expect: [14, 18], why: "contour GUI + CV labs" },
  { query: "sql", expect: [13], why: "tag + description match" },
  { query: "node", expect: [13], why: "part of the Node.js tag" },
  { query: "nodejs", expect: [13], why: "squashed form of Node.js" },
  { query: "u-net", expect: [1, 6], why: "punctuated tag kept intact — Conservation Watch + Homecraft" },
  { query: "unet", expect: [1, 6], why: "squashed form of U-Net" },
  { query: "net", expect: [1, 6, 20], why: "U-Net / neural networks — NOT 'geNETic' (old bug)" },
  { query: "rag", expect: [5, 7], why: "RAG from scratch + RAG ChatBot — word start only" },
  { query: "ai", expect: [3, 4, 6, 8, 9, 11, 16, 17, 20], why: "word start only — no mid-word 'ai' hits" },
  { query: "react", expect: [8], why: "only the portfolio website tags React" },
  { query: "c++", expect: [15], why: "'+' preserved in tokens" },
  { query: "numpy", expect: [5, 10], why: "the from-scratch NumPy projects" },
  { query: "trading", expect: [4], why: "the LLM paper-trading agent" },
  { query: "svg", expect: [10], why: "the Image-to-SVG vectorizer" },
  { query: "spotify", expect: [12], why: "the Spotify->YT Music migrator" },
  { query: "oauth", expect: [12], why: "migrator's OAuth tag" },
  { query: "llm", expect: [3, 4, 7], why: "IT blog + LLM agent + RAG ChatBot LLM tag" },
  { query: "transformers", expect: [5, 7, 8], why: "RAG-from-scratch tag + DOF-RAG sentence-transformers + Transformers.js" },
  { query: "gamification", expect: [9], why: "Code Pets' own tag" },
  { query: "data structures", expect: [19, 20], why: "C repo + ESCOM repository" },
  { query: "python sudoku", expect: [11, 17], why: "both genetic sudoku projects (AND semantics)" },
  { query: "computer vision", expect: [6, 10, 14, 18, 20], why: "phrase across tags/titles/descriptions" },
  { query: "deep learning", expect: [1, 5, 20], why: "Conservation Watch + RAG-from-scratch + ESCOM repo" },
  { query: "stable diffusion", expect: [6], why: "two-word tag" },
  { query: "blog", expect: [3], why: "the IT blog, by title" },
  { query: "static site generator", expect: [3], why: "three-word tag, every word must match" },
  { query: "machine learning", expect: [1, 2, 5, 6, 7, 20], why: "the Machine Learning tag across the ML projects" },
  { query: "data science", expect: [1, 2], why: "Data Science tag — NOT 'Data Structures' (AND semantics)" },
  { query: "pytorch", expect: [1, 5, 6, 10], why: "PyTorch as a tag and in descriptions" },
  { query: "lightgbm", expect: [2], why: "Metro Flow's forecaster" },
  { query: "time series", expect: [2], why: "Metro Flow's Time Series tag" },
  { query: "anomaly", expect: [2], why: "Metro Flow's Anomaly Detection tag" },
  { query: "remote sensing", expect: [1], why: "Conservation Watch's Remote Sensing tag" },
  { query: "sentinel", expect: [1], why: "Sentinel-2 in Conservation Watch's title" },
  { query: "vue", expect: [7], why: "the DOF-RAG Vue front end" },
  { query: "pinecone", expect: [7], why: "DOF-RAG's vector store" },
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
