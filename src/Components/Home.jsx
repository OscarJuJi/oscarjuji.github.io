import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

import resumePdf from "url:../../public/resume.pdf";
import cvPdf from "url:../../public/cv.pdf";

const resume = resumePdf;
const cv = cvPdf;

const typingPhrases = [
  "Artificial Intelligence Engineer",
  "Data Engineer",
  "Full Stack Developer",
  "Machine Learning Practitioner",
  "Software Developer",
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
          <span className="typed-cursor" aria-hidden="true">
            ▌
          </span>
        </p>

        <p className="hero-description fade-in delay-3">
          Artificial Intelligence Engineering graduate passionate about developing intelligent systems. I enjoy turning ideas into functional software.
        </p>

        <div className="hero-actions fade-in delay-4">
          <a href={cv} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            ↓ Curriculum
          </a>
          <a href={resume} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            ↓ Resume
          </a>
          <a href="#contact" className="btn btn-ghost">
            Get in touch →
          </a>
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
