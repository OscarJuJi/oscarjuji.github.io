import React from "react";

const experienceList = [
  {
    date: "Jun – Dec 2024",
    title: "Full-Stack Intern",
    company: "Banco de México",
    bullets: [
      "Boosted system performance by 30% by optimizing SQL queries and reducing algorithmic complexity in Java and JavaScript.",
      "Streamlined the user interface for an internal tool, improving UX through a more intuitive and responsive design.",
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
        Industry roles where I delivered measurable impact across backend performance and UX.
      </p>

      <div className="timeline">
        {experienceList.map((job, i) => (
          <div key={`${job.company}-${i}`} className={`timeline-item fade-in delay-${i + 1}`}>
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
