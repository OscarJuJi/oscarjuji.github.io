import React from "react";

const experienceList = [
  {
    date: "Jul 2025 – Present",
    title: "Data Engineer",
    company: "Bluetab (an IBM Company) · BBVA",
    bullets: [
      "Implement ETL pipelines — ingestion, transformation, and storage — integrating multiple data sources into the bank's core data infrastructure.",
      "Manage datasets and tables in AWS S3, ensuring structured storage and efficient access for Spark-based processing and advanced analytics.",
      "Maintain and optimize data pipelines in distributed cluster environments, guaranteeing reliability, quality, and high availability.",
      "Collaborate on data integration strategies for analytical use cases and ML models within the structural risk division.",
    ],
  },
  {
    date: "Feb – Jul 2025",
    title: "Innovation & Development Intern",
    company: "Grupo Salinas",
    bullets: [
      "Researched, developed, and deployed AI tools to optimize business workflows and validate models in innovation-driven environments.",
      "Engineered AI agents, conversational chatbots, visual prototypes, and dynamic landing pages for internal business units.",
    ],
  },
  {
    date: "Jun – Dec 2024",
    title: "Full-Stack Intern",
    company: "Banco de México",
    bullets: [
      "Boosted system performance by 30% by optimizing SQL queries and reducing algorithmic complexity in Java and JavaScript.",
      "Streamlined an internal tool's UX through a more intuitive and responsive interface redesign.",
      "Enforced database integrity and security via normalization, stored procedures, views, indexing, and role-based access control in Oracle SQL.",
    ],
  },
];

const ProfessionalExperience = () => (
  <section id="experience" className="timeline-section">
    <div className="container">
      <span className="section-label fade-in">Work History</span>
      <h2 className="section-title fade-in delay-1">Professional Experience</h2>
      <p className="section-subtitle fade-in delay-2">
        Three industry roles delivering measurable impact across data engineering, AI product
        development, and full-stack systems.
      </p>

      <div className="timeline">
        {experienceList.map((job, i) => (
          <div key={`${job.company}-${i}`} className={`timeline-item fade-in delay-${Math.min(i + 1, 5)}`}>
            <div className="timeline-dot" />
            <div className="timeline-date">{job.date}</div>
            <div className="timeline-card">
              <h3>{job.title}</h3>
              <div className="timeline-company">{job.company}</div>
              <ul>
                {job.bullets.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ProfessionalExperience;
