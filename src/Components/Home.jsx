import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const resume = "/resume.pdf";
const cv = "/cv.pdf";

const typingPhrases = [
  "Artificial Intelligence Engineer",
  "Full Stack Developer",
  "Machine Learning Enthusiast",
  "Problem Solver",
];

const Home = ({ name }) => {
  const typedRef = useRef(null);

  useEffect(() => {
    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;

    const TYPING_SPEED = 75;
    const DELETING_SPEED = 40;
    const PAUSE_AFTER_TYPED = 2200;
    const PAUSE_AFTER_DELETED = 300;

    let timeoutId;

    const tick = () => {
      const phrase = typingPhrases[phraseIdx];
      if (!typedRef.current) return;

      if (!deleting) {
        charIdx++;
        typedRef.current.textContent = phrase.slice(0, charIdx);
        if (charIdx === phrase.length) {
          deleting = true;
          timeoutId = setTimeout(tick, PAUSE_AFTER_TYPED);
          return;
        }
        timeoutId = setTimeout(tick, TYPING_SPEED);
      } else {
        charIdx--;
        typedRef.current.textContent = phrase.slice(0, charIdx);
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % typingPhrases.length;
          timeoutId = setTimeout(tick, PAUSE_AFTER_DELETED);
          return;
        }
        timeoutId = setTimeout(tick, DELETING_SPEED);
      }
    };

    timeoutId = setTimeout(tick, 800);
    return () => clearTimeout(timeoutId);
  }, []);

  const stats = [
    { number: "6+", label: "Projects Built" },
    { number: "6mo", label: "Industry Experience" },
    { number: "28+", label: "Technologies" },
    { number: "4+", label: "Certifications" },
  ];

  return (
    <section id="home" className="hero">
      <div className="hero-bg" aria-hidden="true" />

      <div className="hero-content">
        <div className="hero-tag fade-in">Available for opportunities</div>

        <h1 className="fade-in delay-1">
          <span className="hero-name">{name}</span>
        </h1>

        <p className="hero-title fade-in delay-2" aria-live="polite">
          <span ref={typedRef} />
          <span className="typed-cursor" aria-hidden="true">|</span>
        </p>

        <p className="hero-description fade-in delay-3">
          AI Engineering student at ESCOM–IPN passionate about building
          intelligent systems. From machine learning pipelines to full-stack
          applications — I turn ideas into working software.
        </p>

        <div className="hero-actions fade-in delay-4">
          <a
            href={resume}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            ↓ Curriculum
          </a>
          <a
            href={cv}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            ↓ Resume
          </a>
          <a href="#contact" className="btn btn-ghost">
            Get in touch →
          </a>
        </div>

        <div className="hero-stats fade-in delay-4">
          {stats.map((s) => (
            <div key={s.label}>
              <span className="hero-stat-number">{s.number}</span>
              <span className="hero-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <a href="#about" className="scroll-cue" aria-label="Scroll to About">
        <div className="scroll-line" />
        <span>Scroll</span>
      </a>
    </section>
  );
};

Home.defaultProps = {
  name: "Oscar Juarez",
};

Home.propTypes = {
  name: PropTypes.string.isRequired,
};

export default Home;
