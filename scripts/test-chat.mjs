/**
 * Test cases for the portfolio chatbot brain.
 * Parts 1–2 are instant; Part 3 loads the real DistilBERT model
 * (downloads ~65 MB the first time, cached after) and asks real questions.
 * Run with: npm run test:chat
 */
import { CHUNKS, rankChunks, answerQuestion } from "../src/ai-brain.mjs";

let failed = 0;
const check = (ok, label, detail) => {
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}`);
  if (detail) console.log(`      ${detail}`);
};

console.log("— 1. Chunk budget (DistilBERT reads ~512 tokens, so keep chunks ≤ 350 words) —");
for (const chunk of CHUNKS) {
  const wordCount = chunk.text.split(/\s+/).length;
  check(wordCount <= 350, `${chunk.id.padEnd(18)} ${wordCount} words`);
}

console.log("\n— 2. Retrieval picks the right topic chunk —");
const RETRIEVAL = [
  ["What is Oscar's current job?", ["experience"]],
  ["Where does Oscar work?", ["experience"]],
  ["What is Oscar's GPA?", ["education"]],
  ["Where did Oscar study?", ["education"]],
  ["What certifications does Oscar have?", ["certifications"]],
  ["What cloud platforms does he know?", ["skills"]],
  ["What is Oscar's email?", ["profile"]],
  ["What projects has Oscar built?", ["ai-projects", "software-projects"]],
  ["How much faster is the Sudoku solver?", ["ai-projects"]],
  ["Is Oscar open to new opportunities?", ["profile"]],
  ["What is Oscar's most recent project?", ["ai-projects"]],
  ["How many years of experience does Oscar have?", ["experience"]],
];
for (const [question, wanted] of RETRIEVAL) {
  const top = rankChunks(question)[0];
  check(wanted.includes(top.id) && top.score > 0, `"${question}" -> ${top.id} (score ${top.score})`);
}

console.log("\n— 3. End-to-end answers with the real model —");
console.log("Loading Xenova/distilbert-base-cased-distilled-squad…");
const { pipeline } = await import("@xenova/transformers");
const qa = await pipeline("question-answering", "Xenova/distilbert-base-cased-distilled-squad");

const E2E = [
  ["What is Oscar's current job?", /data engineer/i],
  ["Where does Oscar work right now?", /bluetab|bbva/i],
  ["What is Oscar's GPA?", /9\.5/],
  ["Where did Oscar study?", /escom|polit[eé]cnico|ipn/i],
  ["When did Oscar graduate?", /2025/],
  ["What is Oscar's email address?", /oscar\.a\.juarez\.j@gmail\.com/i],
  ["What cloud platforms does he know?", /aws|amazon|google cloud|azure/i],
  ["What projects has Oscar built?", /nerf|rag|sudoku|segmentation/i],
  ["What did Oscar do at Banco de México?", /30%|performance|sql|oracle|full-stack intern/i],
  ["How much faster is the Sudoku solver?", /20%/],
  ["What certifications does Oscar have?", /certification|aws|scrum|google|oracle/i],
  ["Is Oscar open to new opportunities?", /open|opportunit/i],
  ["What is Oscar's most recent project?", /portfolio website/i],
  ["What are his latest projects?", /portfolio website|nerf|sudoku/i],
  ["How many years of experience does Oscar have?", /\d+ years/],
  ["What is Oscar's favorite food?", /couldn't find/i],
];
for (const [question, wanted] of E2E) {
  const { answer, source, confidence } = await answerQuestion(question, (q, ctx) => qa(q, ctx));
  check(wanted.test(answer), `"${question}"`, `[${source ?? "no-chunk"} conf ${confidence.toFixed(2)}] ${answer}`);
}

console.log(`\n${failed === 0 ? "ALL TESTS PASSED" : `${failed} TEST(S) FAILED`}`);
if (failed > 0) process.exitCode = 1;
