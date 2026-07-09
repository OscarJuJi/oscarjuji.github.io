/**
 * Project data + search logic for the Portfolio section.
 *
 * Matching rules (word-prefix, AND semantics):
 *  - The query is split into words and EVERY word must match the project.
 *  - A word matches when any project token (from title, description, or tags)
 *    STARTS WITH it — "pyt" matches "Python", but "net" no longer matches "geNETic".
 *  - Punctuated tokens also index their parts and a squashed form, so
 *    "node", "node.js" and "nodejs" all find the same project.
 *
 * `year` is the project's most recent activity (used by the chatbot to answer
 * "most recent project" questions); it does not affect search or rendering.
 *
 * Kept free of React/JSX so `scripts/test-filter.mjs` can run it in plain Node.
 */

export const projectList = [
  {
    title: "Object Segmentation for Indoor 3D Model Editing Using NeRF",
    description:
      "AI-based object segmentation system for editing 3D models in interior environments. Boosted classification accuracy by 30% by integrating ML algorithms into a U-Net base. Achieved photorealistic editing by combining NeRF spatial reconstruction with Stable Diffusion texture synthesis.",
    url: "https://github.com/OscarJuJi/Homecraft",
    tags: ["Python", "NeRF", "U-Net", "Stable Diffusion", "PyTorch", "Computer Vision"],
    year: 2025,
  },
  {
    title: "RAG ChatBot for Mexico's Official Gazette (DOF)",
    description:
      "Retrieval-Augmented Generation system over an LLM to generate summaries and answer natural-language queries about Mexico's Diario Oficial de la Federación. Built with LangChain + LangServe for retrieval orchestration and Pinecone for vector storage.",
    url: "https://github.com/JoseLuisMonroy/ISSI-Backend",
    tags: ["Python", "LangChain", "RAG", "Pinecone", "LLM", "FastAPI"],
    year: 2024,
  },
  {
    title: "Genetic Algorithm Sudoku Solver",
    description:
      "Solves hard-level Sudoku puzzles 20% faster than baseline approaches using evolutionary strategies — selection, crossover, and mutation — to efficiently explore the solution space.",
    url: "https://github.com/OscarJuJi/Genetic-Algorithm-Sudoku-Solver",
    tags: ["Python", "Genetic Algorithms", "Optimization", "Bio-Inspired AI"],
    year: 2025,
  },
  {
    title: "Grupo Salinas Event App (SG_event)",
    description:
      "React application built for a corporate event at Grupo Salinas during Oscar's Innovation & Development internship, delivering a responsive and dynamic event experience.",
    url: "https://github.com/OscarJuJi/SG_event",
    tags: ["React", "JavaScript", "Frontend"],
    year: 2025,
  },
  {
    title: "AI-Powered Portfolio Website",
    description:
      "This site — a React portfolio with an in-browser AI chatbot that answers questions about Oscar using DistilBERT running fully client-side with Transformers.js (no backend), plus a smart project search filter, all verified by automated test suites.",
    url: "https://github.com/OscarJuJi/oscarjuji.github.io",
    tags: ["React", "Transformers.js", "AI", "JavaScript"],
    year: 2026,
  },
  {
    title: "Student Management System",
    description:
      "Streamlines academic enrollment and course assignments. Improved system performance, security, and scalability using AJAX, Node.js, and Bootstrap with a relational SQL backend.",
    url: "https://github.com/Ricardo8421/crujirepo",
    tags: ["Node.js", "AJAX", "Bootstrap", "SQL"],
    year: 2023,
  },
  {
    title: "Object Contour Identifier & Classifier",
    description:
      "MATLAB GUI that identifies object edges in natural images using digital image processing techniques, then classifies the scene environment using computed edge features.",
    url: "https://github.com/OscarJuJi/object_contours_identifiying_and_classifying",
    tags: ["MATLAB", "Computer Vision", "Image Processing"],
    year: 2025,
  },
  {
    title: "C++ Matrix Solver",
    description:
      "Command-line C++ program for solving MxN matrix problems and performing various matrix operations.",
    url: "https://github.com/OscarJuJi/Matrix_solver",
    tags: ["C++", "Algorithms", "Math"],
    year: 2025,
  },
  {
    title: "Bio-Inspired Algorithms Collection",
    description:
      "Implementations of nature-inspired optimization and problem-solving techniques — code, examples, and resources from the Bio-Inspired Algorithms course at ESCOM.",
    url: "https://github.com/OscarJuJi/Bioinspired-Algorithms",
    tags: ["Bio-Inspired AI", "Optimization", "Algorithms"],
    year: 2025,
  },
  {
    title: "Computer Vision & Image Processing Labs",
    description:
      "MATLAB lab work for the Digital Image Processing and Computer Vision courses — hands-on practice with image transformations and vision techniques.",
    url: "https://github.com/OscarJuJi/Computer-Vision",
    tags: ["MATLAB", "Computer Vision", "Image Processing"],
    year: 2025,
  },
  {
    title: "ESCOM AI Engineering Repository",
    description:
      "A curated collection of coursework spanning data structures, software engineering, computer vision, neural networks, and deep learning — covering the full Artificial Intelligence Engineering program.",
    url: "https://github.com/OscarJuJi",
    tags: ["Python", "Deep Learning", "Various"],
    year: 2025,
  },
];

// Strip punctuation from word edges but keep + and # so "c++" / "c#" survive.
const cleanWord = (word) => word.replace(/^[^a-z0-9+#]+/, "").replace(/[^a-z0-9+#]+$/, "");

export const queryTokens = (query) =>
  query.toLowerCase().split(/\s+/).map(cleanWord).filter(Boolean);

export const projectTokens = (project) => {
  const text = [project.title, project.description, ...project.tags].join(" ").toLowerCase();
  const tokens = new Set();
  for (const raw of text.split(/\s+/)) {
    const word = cleanWord(raw);
    if (!word) continue;
    tokens.add(word);
    // "u-net" -> "u", "net"   |   "node.js" -> "node", "js"
    for (const part of word.split(/[^a-z0-9+#]+/)) {
      if (part) tokens.add(part);
    }
    // "u-net" -> "unet"   |   "node.js" -> "nodejs"
    const squashed = word.replace(/[^a-z0-9]/g, "");
    if (squashed) tokens.add(squashed);
  }
  return tokens;
};

export const projectMatches = (project, query) => {
  const words = queryTokens(query);
  if (words.length === 0) return true;
  const tokens = [...projectTokens(project)];
  return words.every((word) => tokens.some((token) => token.startsWith(word)));
};
