import React, { useState } from "react";
import { projectList, projectMatches } from "../portfolio-search.mjs";
import { SearchIcon } from "./Icons";

const QUICK_FILTERS = ["Python", "React", "Computer Vision", "RAG", "Deep Learning", "SQL", "MATLAB", "C++"];

const Portfolio = () => {
  const [query, setQuery] = useState("");

  const visibleTitles = new Set(
    projectList.filter((project) => projectMatches(project, query)).map((project) => project.title)
  );
  const searching = query.trim().length > 0;
  const matchCount = visibleTitles.size;

  return (
    <section id="portfolio" className="portfolio-section">
      <div className="container">
        <span className="section-label fade-in">My Work</span>
        <h2 className="section-title fade-in delay-1">Featured Projects</h2>
        <p className="section-subtitle fade-in delay-2">
          AI, ML, and full-stack projects spanning NeRF-based 3D reconstruction, RAG systems,
          bio-inspired algorithms, and more.
        </p>

        <div className="project-search-wrap fade-in delay-3">
          <span className="project-search-icon" aria-hidden="true">
            <SearchIcon size={15} />
          </span>
          <input
            className="project-search"
            type="text"
            placeholder="Search by skill, technology, or keyword…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Filter projects"
          />
          {query && (
            <button className="project-search-clear" onClick={() => setQuery("")} aria-label="Clear search">
              ✕
            </button>
          )}
        </div>

        <div className="project-quick-filters fade-in delay-3">
          {QUICK_FILTERS.map((tag) => {
            const active = query.toLowerCase() === tag.toLowerCase();
            return (
              <button
                key={tag}
                className={`project-chip${active ? " active" : ""}`}
                onClick={() => setQuery(active ? "" : tag)}
                aria-pressed={active}
              >
                {tag}
              </button>
            );
          })}
        </div>

        <p className="project-search-count" aria-live="polite">
          {!searching
            ? " "
            : matchCount === 0
            ? `No projects match “${query}” — try another keyword or a tag above.`
            : `Showing ${matchCount} of ${projectList.length} projects`}
        </p>

        <div className="projects-grid">
          {projectList.map((project, i) => {
            const visible = visibleTitles.has(project.title);
            return (
              <article
                key={project.title}
                className={`project-card fade-in${visible ? "" : " project-hidden"}`}
                style={{ transitionDelay: `${(i % 3) * 0.1}s` }}
              >
                <div className="project-num">Project {String(i + 1).padStart(2, "0")}</div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-tags">
                  {project.tags.map((tag) => {
                    const active = query.toLowerCase() === tag.toLowerCase();
                    return (
                      <button
                        key={tag}
                        type="button"
                        className={`project-tag${active ? " active" : ""}`}
                        onClick={() => setQuery(active ? "" : tag)}
                        aria-pressed={active}
                        aria-label={`Filter projects by ${tag}`}
                      >
                        {tag}
                      </button>
                    );
                  })}
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
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
