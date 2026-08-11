import React from "react";
import {
  aboutDescription as description,
  aboutQuote as quote,
  aboutStats as stats,
  skillsList,
} from "../site-data.mjs";
import { GraduationIcon, BriefcaseIcon, TrophyIcon, RocketIcon } from "./Icons";

const STAT_ICONS = {
  graduation: GraduationIcon,
  briefcase: BriefcaseIcon,
  trophy: TrophyIcon,
  rocket: RocketIcon,
};

const About = () => (
  <>
    <section id="about" className="about-section">
      <div className="container">
        <div className="about-grid">
          <div className="about-text">
            <span className="section-label fade-in">Who I Am</span>
            <h2 className="section-title fade-in delay-1">Who I Am</h2>
            <p className="fade-in delay-2">{description}</p>
            <blockquote className="about-quote fade-in delay-3">{quote}</blockquote>
          </div>

          <div className="stat-cards">
            {stats.map((s, i) => {
              const StatIcon = STAT_ICONS[s.icon];
              return (
                <div key={s.label} className={`stat-card fade-in delay-${i + 1}`}>
                  <span className="stat-card-emoji">{StatIcon && <StatIcon size={24} />}</span>
                  <span className="stat-card-number">{s.number}</span>
                  <span className="stat-card-label">{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>

    <section className="skills-section">
      <div className="container">
        <span className="section-label fade-in">Technical Skills</span>
        <h2 className="section-title fade-in delay-1">Tools &amp; Technologies</h2>
        <p className="section-subtitle fade-in delay-2">
          A broad toolkit spanning AI/ML research, cloud data engineering, and full-stack development.
        </p>
        <div className="skills-grid">
          {skillsList.map((skill, i) => (
            <div
              key={skill.name}
              className="skill-card fade-in"
              style={{ transitionDelay: `${(i % 9) * 0.045}s` }}
            >
              <img src={skill.icon} alt={`${skill.name} logo`} loading="lazy" />
              <span>{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default About;
