import React from "react";

const projectList = [
  {
    title: "HomeCraft — AI-Driven 3D Interior Design",
    description:
      "Capture a room video, extract key frames, segment objects, apply inpainting, and generate a fully editable 3D model. Enables seamless virtual home redesigns without physically modifying the space.",
    url: "https://github.com/PhilipSanM/Homecraft",
    tags: ["Python", "PyTorch", "OpenCV", "3D Modeling", "Inpainting"],
  },
  {
    title: "RAG ChatBot for Mexico's Official Gazette",
    description:
      "Natural-language query interface over the Mexican DOF. Built a Retrieval-Augmented Generation pipeline over an LLM to generate summaries and answer precise document queries.",
    url: "https://github.com/JoseLuisMonroy/ISSI-Backend",
    tags: ["Python", "LLM", "RAG", "NLP", "FastAPI"],
  },
  {
    title: "Genetic Algorithm Sudoku Solver",
    description:
      "Solves hard-level Sudoku puzzles 20% faster than baseline approaches using evolutionary strategies — selection, crossover, and mutation — to efficiently explore the solution space.",
    url: "https://oscarjuji.github.io/Portfolio/",
    tags: ["Python", "Genetic Algorithms", "Optimization"],
  },
  {
    title: "Student Management System",
    description:
      "Streamlines academic enrollment and course assignments. Improved system performance, security, and scalability using AJAX, Node.js, and Bootstrap with a relational SQL backend.",
    url: "https://github.com/Ricardo8421/crujirepo",
    tags: ["Node.js", "AJAX", "Bootstrap", "SQL"],
  },
  {
    title: "Object Contour Identifier & Classifier",
    description:
      "MATLAB GUI that identifies object edges in natural images using digital image processing techniques, then classifies the scene environment using computed features.",
    url: "https://github.com/OscarJuJi/object_contours_identifiying_and_classifying",
    tags: ["MATLAB", "Computer Vision", "Image Processing"],
  },
  {
    title: "ESCOM AI Engineering Repository",
    description:
      "A curated collection of projects from data structures and software engineering to computer vision, neural networks, deep learning, and more — spanning my full degree program.",
    url: "https://github.com/OscarJuJi",
    tags: ["Python", "Deep Learning", "Various"],
  },
];

const Portfolio = () => (
  <section id="portfolio" className="portfolio-section">
    <div className="container">
      <span className="section-label fade-in">My Work</span>
      <h2 className="section-title fade-in delay-1">Featured Projects</h2>
      <p className="section-subtitle fade-in delay-2">
        A selection of AI, ML, and full-stack projects built during my studies and internship.
      </p>

      <div className="projects-grid">
        {projectList.map((project, i) => (
          <article key={project.title} className="project-card fade-in" style={{ transitionDelay: `${(i % 3) * 0.1}s` }}>
            <div className="project-num">Project {String(i + 1).padStart(2, "0")}</div>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="project-tags">
              {project.tags.map((tag) => (
                <span key={tag} className="project-tag">{tag}</span>
              ))}
            </div>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
              aria-label={`View ${project.title} on GitHub`}
            >
              View on GitHub →
            </a>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Portfolio;
