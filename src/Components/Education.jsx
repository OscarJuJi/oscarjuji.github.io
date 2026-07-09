import React from "react";
import { educationList } from "../site-data.mjs";

const Education = () => (
  <section id="education" className="timeline-section alt-bg">
    <div className="container">
      <span className="section-label fade-in">Academic Background</span>
      <h2 className="section-title fade-in delay-1">Education &amp; Certifications</h2>
      <p className="section-subtitle fade-in delay-2">
        A strong academic foundation at IPN paired with 10+ industry certifications spanning cloud,
        AI, agile, and secure development.
      </p>

      <div className="timeline">
        {educationList.map((item, i) => (
          <div key={item.title} className={`timeline-item fade-in delay-${Math.min(i + 1, 5)}`}>
            <div className="timeline-dot" />
            <div className="timeline-date">{item.date}</div>
            <div className="timeline-card">
              <h3>{item.title}</h3>
              <div className="timeline-company">{item.institution}</div>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Education;
