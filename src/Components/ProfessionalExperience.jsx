import React from "react";
import { experienceList } from "../site-data.mjs";

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
