import React from "react";

const projectList = [
  {
    title: "Object Segmentation for Indoor 3D Model Editing Using NeRF",
    description:
      "AI-based object segmentation system for editing 3D models in interior environments. Boosted classification accuracy by 30% by integrating ML algorithms into a U-Net base. Achieved photorealistic editing by combining NeRF spatial reconstruction with Stable Diffusion texture synthesis.",
    url: "https://github.com/PhilipSanM/Homecraft",
    tags: ["Python", "NeRF", "U-Net", "Stable Diffusion", "PyTorch", "Computer Vision"],
  },
  {
    title: "RAG ChatBot for Mexico's Official Gazette (DOF)",
    description:
      "Retrieval-Augmented Generation system over an LLM to generate summaries and answer natural-language queries about Mexico's Diario Oficial de la Federación. Built with LangChain + LangServe for retrieval orchestration and Pinecone for vector storage.",
    url: "https://github.com/JoseLuisMonroy/ISSI-Backend",
    tags: ["Python", "LangChain", "RAG", "Pinecone", "LLM", "FastAPI"],
  },
  {
    title: "Genetic Algorithm Sudoku Solver",
    description:
      "Solves hard-level Sudoku puzzles 20% faster than baseline approaches using evolutionary strategies — selection, crossover, and mutation — to efficiently explore the solution space.",
    url: "https://oscarjuji.github.io/Portfolio/",
    tags: ["Python", "Genetic Algorithms", "Optimization", "Bio-Inspired AI"],
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
      "MATLAB GUI that identifies object edges in natural images using digital image processing techniques, then classifies the scene environment using computed edge features.",
    url: "https://github.com/OscarJuJi/object_contours_identifiying_and_classifying",
    tags: ["MATLAB", "Computer Vision", "Image Processing"],
  },
  {
    title: "ESCOM AI Engineering Repository",
    description:
      "A curated collection of coursework spanning data structures, software engineering, computer vision, neural networks, and deep learning — covering the full Artificial Intelligence Engineering program.",
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
        AI, ML, and full-stack projects spanning NeRF-based 3D reconstruction, RAG systems,
        bio-inspired algorithms, and more.
      </p>

      <div className="projects-grid">
        {projectList.map((project, i) => (
          <article
            key={project.title}
            className="project-card fade-in"
            style={{ transitionDelay: `${(i % 3) * 0.1}s` }}
          >
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
