import React from "react";

import Header from "./Header";
import Footer from "./Footer";
import { profile, siteProps, aboutQuote } from "../site-data.mjs";
import { useDarkMode, useScrollReveal } from "../hooks";
import photo from "../images/about-placeholder.svg";
import "../styles.css";

// Personal-page content. Written in English to match the rest of the site.
// The narrative below is drafted from public facts; the {/* TODO */} spots
// and the interests are placeholders for Oscar to personalize.

const values = [
  {
    title: "Curiosity first",
    text:
      "I learn by taking things apart — building models and pipelines from scratch until I understand exactly why they work, not just that they do.",
  },
  {
    title: "Rigor with creativity",
    text:
      "Great engineering is equal parts discipline and imagination: solid data foundations underneath, room to explore smarter solutions on top.",
  },
  {
    title: "Build things that matter",
    text:
      "I care about turning research-grade ideas into dependable systems that create real, measurable value for the people who use them.",
  },
];

// TODO: replace these with your real interests — a photo caption, a sport,
// music, travel, side quests… anything that shows the human behind the code.
const interests = [
  {
    title: "Lifelong learning",
    text: "Reading papers and building small experiments to stay on top of where AI is heading.",
  },
  {
    title: "Side projects",
    text: "From an autonomous trading agent to an image vectorizer — I scratch my own itches with code.",
  },
  {
    title: "Your interest here",
    text: "Add a hobby, sport, or passion of yours — this is where your personality shines through.",
  },
  {
    title: "Your interest here",
    text: "Music, gaming, travel, cooking… tell visitors what you love outside of engineering.",
  },
];

const AboutMePage = () => {
  const [darkMode, toggleDark] = useDarkMode();
  useScrollReveal();

  return (
    <div id="main">
      <Header darkMode={darkMode} onToggleDark={toggleDark} linkBase="/" />

      {/* Hero */}
      <section className="aboutme-hero">
        <div className="container aboutme-hero-inner">
          <div className="aboutme-photo-wrap fade-in-left">
            <img src={photo} alt={`${profile.fullName}`} className="aboutme-photo" />
          </div>

          <div className="aboutme-intro fade-in-right">
            <span className="section-label">About Me</span>
            <h1 className="aboutme-name">
              Hi, I&apos;m Oscar<span style={{ color: "var(--color-accent)" }}>.</span>
            </h1>
            <p className="aboutme-tagline">
              An Artificial Intelligence Engineer who loves building intelligent systems from the
              ground up — and understanding every layer in between.
            </p>
            <ul className="aboutme-facts">
              <li>Based in {profile.location}</li>
              <li>Speaks Spanish (native) &amp; English (professional)</li>
              <li>Codes primarily in Python</li>
            </ul>
            <div className="aboutme-cta">
              <a href="/#portfolio" className="btn btn-primary">Explore my work →</a>
              <a href="/#contact" className="btn btn-outline">Get in touch</a>
            </div>
          </div>
        </div>
      </section>

      {/* My Story */}
      <section className="aboutme-section">
        <div className="container aboutme-prose">
          <span className="section-label fade-in">My Story</span>
          <h2 className="section-title fade-in delay-1">How I got here</h2>
          <p className="fade-in delay-2">
            I studied Artificial Intelligence Engineering at ESCOM–IPN in Mexico City, where I fell
            in love with the space where mathematics, software, and real-world problems meet. What
            started as curiosity about how machines &ldquo;learn&rdquo; turned into a genuine craft.
          </p>
          <p className="fade-in delay-2">
            My path runs across the full lifecycle of intelligent systems: I began in full-stack
            development, moved into data engineering — building the pipelines that make AI possible —
            and kept gravitating toward machine learning, computer vision, and generative AI. Today I
            work as a Data Engineer while building AI projects that push me to learn something new
            every time.
          </p>
          {/* TODO: personalize — add a sentence or two about a pivotal moment,
              a project you're proud of, or where you want to go next. */}
          <p className="fade-in delay-3">
            I believe the best way to understand a technology is to build it yourself, so I often
            re-implement the hard parts from scratch. It is slower, but it is how I make sure I truly
            understand the tools I rely on.
          </p>
        </div>
      </section>

      {/* What Drives Me */}
      <section className="aboutme-section alt-bg">
        <div className="container">
          <span className="section-label fade-in">What Drives Me</span>
          <h2 className="section-title fade-in delay-1">My principles</h2>
          <blockquote className="aboutme-quote fade-in delay-2">{aboutQuote}</blockquote>
          <div className="aboutme-values">
            {values.map((v, i) => (
              <div key={v.title} className={`aboutme-value-card fade-in delay-${i + 1}`}>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beyond the Code */}
      <section className="aboutme-section">
        <div className="container">
          <span className="section-label fade-in">Beyond the Code</span>
          <h2 className="section-title fade-in delay-1">When I&apos;m not shipping</h2>
          <p className="section-subtitle fade-in delay-2">
            A few things that keep me curious outside of work.
          </p>
          <div className="aboutme-interests">
            {interests.map((it, i) => (
              <div key={`${it.title}-${i}`} className="aboutme-interest-card fade-in">
                <h3>{it.title}</h3>
                <p>{it.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer {...siteProps} />
    </div>
  );
};

export default AboutMePage;
