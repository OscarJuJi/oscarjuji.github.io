/**
 * Q&A "brain" for the portfolio chatbot.
 *
 * The answer context is built from the SAME data modules the page renders
 * (site-data.mjs + portfolio-search.mjs), so the bot and the page can never
 * disagree. Because the DistilBERT QA model can only read ~512 tokens at a
 * time, the content is split into topic chunks; the best chunks are retrieved
 * by keyword score, the model runs on those, and the extracted span is
 * expanded to its full sentence so answers read naturally.
 *
 * Framework-free so `scripts/test-chat.mjs` can run it in plain Node.
 */
import {
  profile,
  aboutDescription,
  educationList,
  experienceList,
  skillsList,
} from "./site-data.mjs";
import { projectList } from "./portfolio-search.mjs";

export const NOT_FOUND =
  "I couldn't find that in Oscar's portfolio. Try asking about his current job, past experience, projects, skills, education, certifications, or how to contact him.";

export const MIN_CONFIDENCE = 0.05;

// Turn " · " separators from the timeline data into readable prose commas.
const prose = (text) => text.replace(/\s·\s/g, ", ");

const buildChunks = () => {
  const [currentJob, ...previousJobs] = experienceList;
  const [degree, ...certifications] = educationList;
  const gradDate = degree.date.split("–").pop().trim();
  const gpa = (degree.title.match(/GPA\s+([\d.]+\s*\/\s*\d+)/) || [])[1] || "";

  // Years of experience, derived from the earliest role (last in the list).
  const MONTH_INDEX = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
  const firstRole = experienceList[experienceList.length - 1];
  const startYear = Math.min(...(firstRole.date.match(/\d{4}/g) || ["2024"]).map(Number));
  const startMonth = MONTH_INDEX[(firstRole.date.match(/[A-Za-z]{3}/) || ["jan"])[0].toLowerCase()] ?? 0;
  const startLabel = `${firstRole.date.split("–")[0].trim()} ${startYear}`;
  const now = new Date();
  const expMonths = (now.getFullYear() - startYear) * 12 + (now.getMonth() - startMonth);
  const expYears = Math.max(1, Math.floor(expMonths / 12));

  // Most recent projects, by year.
  const byRecency = [...projectList].sort((a, b) => (b.year || 0) - (a.year || 0));

  return [
    {
      id: "profile",
      hints: [
        "who", "name", "about", "contact", "email", "mail", "reach", "linkedin", "github",
        "website", "location", "located", "based", "live", "lives", "city", "country",
        "available", "availability", "open", "opportunities", "opportunity", "hire", "hiring",
        "engineer", "developer",
      ],
      text:
        `${profile.fullName} is an Artificial Intelligence Engineer and Data Engineer based in ${profile.location}. ` +
        `${aboutDescription} ` +
        `Oscar can be contacted by email at ${profile.email}. ` +
        `His GitHub profile is github.com/${profile.gitHub} and his LinkedIn profile is linkedin.com/in/${profile.linkedIn}. ` +
        `His portfolio website is ${profile.website}. ` +
        `Oscar is open to new opportunities in AI engineering and data engineering.`,
    },
    {
      id: "experience",
      hints: [
        "work", "works", "working", "worked", "job", "jobs", "role", "roles", "position",
        "company", "companies", "career", "employer", "experience", "current", "currently",
        "now", "today", "bbva", "bluetab", "ibm", "salinas", "grupo", "banco", "bank",
        "intern", "internship", "etl", "spark", "professional", "years", "year", "long",
      ],
      text:
        `Oscar has three industry roles of professional experience. ` +
        `In total, Oscar has more than ${expYears} years of professional experience in the industry, working since ${startLabel}. ` +
        `Oscar's current job is ${currentJob.title} at ${prose(currentJob.company)}, from ${currentJob.date}. ` +
        `Right now, Oscar works as a ${currentJob.title} at ${prose(currentJob.company)}, and today this is where he works. ` +
        `In this role: ${currentJob.bullets.join(" ")} ` +
        previousJobs
          .map((job) => `Before that, Oscar worked as ${job.title} at ${prose(job.company)} (${job.date}). ${job.bullets.join(" ")}`)
          .join(" "),
    },
    {
      id: "education",
      hints: [
        "study", "studied", "school", "university", "college", "degree", "education",
        "educated", "gpa", "grade", "grades", "graduate", "graduated", "graduation",
        "coursework", "course", "courses", "bachelor", "escom", "ipn", "politecnico",
        "major", "academic",
      ],
      text:
        `Oscar earned a ${prose(degree.title)}, at the Escuela Superior de Cómputo (ESCOM) of the Instituto Politécnico Nacional (IPN) in Mexico City (${degree.date}). ` +
        `Oscar graduated in ${gradDate}. Oscar's GPA is ${gpa}. ` +
        degree.description,
    },
    {
      id: "certifications",
      hints: [
        "certification", "certifications", "certificate", "certificates", "certified",
        "cert", "certs", "aws", "amazon", "azure", "microsoft", "google", "oracle",
        "freecodecamp", "scrum", "safe", "jira", "badge", "badges", "training", "alura",
      ],
      text:
        `Oscar holds more than 10 certifications across cloud, AI, agile, and secure development. ` +
        certifications
          .map((c) => `${prose(c.title)} — ${prose(c.institution)} (${c.date}). ${c.description}`)
          .join(" "),
    },
    {
      id: "skills",
      hints: [
        "skill", "skills", "technology", "technologies", "tech", "tool", "tools", "stack",
        "language", "languages", "framework", "frameworks", "library", "libraries", "cloud",
        "platform", "platforms", "know", "knows", "use", "uses", "programming", "code",
      ],
      text:
        `Oscar's technical skills, tools, and technologies include: ${skillsList.map((s) => s.name).join(", ")}. ` +
        `His programming languages are Python, Java, C++, C#, JavaScript, TypeScript, SQL, and MATLAB. ` +
        `The cloud platforms Oscar knows are Amazon Web Services (AWS), Google Cloud Platform (GCP), and Microsoft Azure.`,
    },
    {
      id: "ai-projects",
      hints: [
        "project", "projects", "built", "build", "builds", "building", "portfolio", "made",
        "created", "recent", "latest", "newest", "last", "new",
        "trading", "trade", "agent", "market", "stock", "finance", "financial", "claude",
        "rag", "numpy", "scratch", "transformer", "perceptron", "nerf", "segmentation",
        "diffusion", "chatbot", "langchain", "pinecone", "gazette", "dof", "3d", "llm",
      ],
      text:
        `Oscar's most recent and latest project is the ${byRecency[0].title} (${byRecency[0].year}). ` +
        `Other recent projects include ${byRecency[1].title} and ${byRecency[2].title}. ` +
        `In total, Oscar has built ${projectList.length} featured projects: ${projectList.map((p) => p.title).join("; ")}. ` +
        projectList.slice(0, 4).map((p) => `${p.title}: ${p.description}`).join(" "),
    },
    {
      id: "applied-projects",
      hints: [
        "project", "projects", "built", "build", "portfolio", "website", "site", "react",
        "image", "svg", "vectorizer", "vector", "raster", "tkinter", "desktop",
        "sudoku", "genetic", "solver", "spotify", "youtube", "music", "migration",
        "migrator", "playlist", "automation", "oauth", "api",
      ],
      text:
        `More of Oscar's projects. ` +
        projectList.slice(4, 8).map((p) => `${p.title}: ${p.description}`).join(" "),
    },
    {
      id: "software-projects",
      hints: [
        "project", "projects", "built", "build", "portfolio", "student", "management",
        "matlab", "contour", "classifier", "escom", "repository", "node", "ajax",
        "bootstrap", "web", "matrix", "labs", "bio", "inspired", "evolutionary",
        "data", "structures", "algorithm", "algorithms", "c++", "cpp",
      ],
      text:
        `More of Oscar's projects. ` +
        projectList.slice(8).map((p) => `${p.title}: ${p.description}`).join(" "),
    },
  ];
};

/* ---------- retrieval ---------- */

const STOPWORDS = new Set([
  "what", "whats", "is", "are", "the", "a", "an", "does", "do", "did", "has", "have",
  "had", "he", "his", "him", "she", "her", "it", "its", "of", "in", "on", "at", "to",
  "for", "and", "or", "with", "tell", "me", "please", "oscar", "oscars", "oscar's",
  "you", "your", "i", "can", "could", "would", "should", "how", "was", "were", "be",
  "been", "being", "that", "this", "there", "their", "they", "them", "from", "by",
  "as", "any", "some", "many", "much",
]);

const cleanWord = (word) => word.replace(/^[^a-z0-9+#]+/, "").replace(/[^a-z0-9+#]+$/, "");

// Lowercase, strip accents ("méxico" -> "mexico"), split, clean edges.
const words = (text) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .split(/\s+/)
    .map(cleanWord)
    .filter(Boolean);

const tokensOf = (text) => {
  const out = new Set();
  for (const w of words(text)) {
    out.add(w);
    for (const part of w.split(/[^a-z0-9+#]+/)) {
      if (part) out.add(part);
    }
  }
  return [...out];
};

export const CHUNKS = buildChunks().map((chunk) => ({ ...chunk, tokens: tokensOf(chunk.text) }));

export const rankChunks = (question) => {
  const qWords = words(question).filter((w) => !STOPWORDS.has(w));
  return CHUNKS.map((chunk) => {
    let score = 0;
    for (const w of qWords) {
      if (chunk.hints.some((h) => h.startsWith(w) || w.startsWith(h))) score += 3;
      if (chunk.tokens.some((t) => t.startsWith(w))) score += 1;
    }
    return { ...chunk, score };
  }).sort((a, b) => b.score - a.score);
};

/* ---------- answer extraction ---------- */

// Sentence boundaries: . ! ? followed by whitespace + capital/digit — so
// "B.Sc.", "Node.js" and "9.5" don't split sentences mid-way.
const sentenceBounds = (text) => {
  const bounds = [0];
  const re = /[.!?](?=\s+[A-ZÁÉÍÓÚÑ0-9("“])|[.!?]$/g;
  let match;
  while ((match = re.exec(text)) !== null) bounds.push(match.index + 1);
  if (bounds[bounds.length - 1] !== text.length) bounds.push(text.length);
  return bounds;
};

// The QA pipeline detokenizes spans with extra spaces ("9. 5 / 10", "20 %").
// Locate the span in the original text by matching characters while ignoring
// whitespace, so we can return the clean original wording.
const locateSpan = (span, text) => {
  const direct = text.indexOf(span);
  if (direct !== -1) return { start: direct, end: direct + span.length };

  const map = [];
  let norm = "";
  for (let i = 0; i < text.length; i++) {
    if (!/\s/.test(text[i])) {
      norm += text[i];
      map.push(i);
    }
  }
  const normSpan = span.replace(/\s+/g, "");
  if (!normSpan) return null;
  const idx = norm.indexOf(normSpan);
  if (idx === -1) return null;
  return { start: map[idx], end: map[idx + normSpan.length - 1] + 1 };
};

export const expandToSentence = (span, text) => {
  const loc = locateSpan(span, text);
  if (!loc) return span;
  const bounds = sentenceBounds(text);
  let start = 0;
  let end = text.length;
  for (const b of bounds) {
    if (b <= loc.start) start = b;
    if (b >= loc.end) {
      end = b;
      break;
    }
  }
  return text.slice(start, end).trim();
};

/**
 * Answer a visitor question.
 * @param {string} question
 * @param {(question: string, context: string) => Promise<{answer: string, score: number}>} qa
 *        The transformers.js question-answering pipeline (or a compatible function).
 */
export async function answerQuestion(question, qa) {
  const ranked = rankChunks(question).filter((c) => c.score > 0);
  // Only consult the runner-up chunk when it scored close to the winner —
  // a weak match (e.g. one incidental word) must not steal the answer.
  const candidates = ranked
    .filter((c, i) => i === 0 || c.score >= Math.max(2, ranked[0].score * 0.5))
    .slice(0, 2);
  if (candidates.length === 0) {
    return { answer: NOT_FOUND, source: null, confidence: 0 };
  }

  let best = null;
  for (const chunk of candidates) {
    const result = await qa(question, chunk.text);
    const confidence = result?.score ?? 0;
    if (!best || confidence > best.confidence) {
      best = { span: (result?.answer ?? "").trim(), confidence, chunk };
    }
  }

  if (!best.span || best.confidence < MIN_CONFIDENCE) {
    return { answer: NOT_FOUND, source: best.chunk.id, confidence: best.confidence };
  }
  return {
    answer: expandToSentence(best.span, best.chunk.text),
    source: best.chunk.id,
    confidence: best.confidence,
  };
}
