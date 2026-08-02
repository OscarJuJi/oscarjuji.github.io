import React from "react";

import Header from "./Header";
import Footer from "./Footer";
import { profile, siteProps } from "../site-data.mjs";
import { useDarkMode, useScrollReveal } from "../hooks";
import photo from "../images/profile.png";
import "../styles.css";

const principles = [
  {
    title: "Think from First Principles",
    text:
      "I enjoy breaking complex problems into their fundamental pieces before designing solutions. Understanding why something works is just as important to me as making it work.",
  },
  {
    title: "Build with Purpose",
    text:
      "Technology creates value when it solves meaningful problems. I strive to build systems that are reliable, scalable, and capable of making a measurable impact on the people who use them.",
  },
  {
    title: "Own the Outcome",
    text:
      "Engineering goes beyond writing code. It means validating assumptions, measuring results, learning from failures, and continuously improving every solution.",
  },
  {
    title: "Learn Relentlessly",
    text:
      "Artificial Intelligence evolves every day. I invest time reading research papers, experimenting with new ideas, and building projects that constantly challenge what I already know.",
  },
  {
    title: "Share Knowledge",
    text:
      "Great engineering is collaborative. I enjoy discussing ideas, documenting what I learn, and helping others grow while continuously learning from them.",
  },
];

const workingStyle = [
  {
    title: "Curiosity over Assumptions",
    text:
      "I prefer asking 'why' before asking 'how'. Deep understanding creates better long-term solutions than quick fixes.",
  },
  {
    title: "Quality over Shortcuts",
    text:
      "Reliable software comes from thoughtful design, careful testing, and attention to detail—not clever hacks.",
  },
  {
    title: "Experimentation over Certainty",
    text:
      "The fastest way to learn is by building. Every experiment, whether successful or not, becomes valuable feedback.",
  },
  {
    title: "Feedback is Data",
    text:
      "Reviews, failures, and different perspectives are opportunities to improve both the product and myself as an engineer.",
  },
];

const interests = [
  {
    title: "Research & Learning",
    text:
      "I enjoy reading the latest papers on large language models, multimodal AI, retrieval systems, and machine learning to better understand where the field is heading.",
  },
  {
    title: "Building Side Projects",
    text:
      "Many weekends become opportunities to prototype ambitious ideas—from Retrieval-Augmented Generation systems to autonomous AI agents and computer vision applications.",
  },
  {
    title: "Cooking",
    text:
      "Learning new recipes reminds me that creativity, experimentation, and iteration exist beyond software engineering. Small improvements often lead to surprisingly better results.",
  },
  {
    title: "Time with my Dog",
    text:
      "Walking and playing with my dog helps me disconnect, recharge, and return to challenging problems with a fresh perspective.",
  },
  {
    title: "Fitness & Discipline",
    text:
      "Strength training has taught me that meaningful progress comes from consistency rather than intensity—an idea that applies equally well to engineering.",
  },
  {
    title: "Strategy Games",
    text:
      "I enjoy activities that reward planning, pattern recognition, and long-term thinking, whether that's chess, strategy games, or solving difficult technical challenges.",
  },
];

const technologies = [
  "Artificial Intelligence",
  "Machine Learning",
  "Large Language Models",
  "Retrieval-Augmented Generation",
  "AI Agents",
  "Computer Vision",
  "Multimodal AI",
  "Data Engineering",
  "Distributed Systems",
  "MLOps",
  "Model Evaluation",
  "AI Safety",
  "Scalable Infrastructure",
  "Generative AI",
];

const AboutMePage = () => {
  const [darkMode, toggleDark] = useDarkMode();

  useScrollReveal();

  return (
    <div id="main">
      <Header
        darkMode={darkMode}
        onToggleDark={toggleDark}
        linkBase="/"
      />

      {/* HERO */}

      <section className="aboutme-hero">
        <div className="container aboutme-hero-inner">

          <div className="aboutme-photo-wrap fade-in-left">
            <img
              src={photo}
              alt={profile.fullName}
              className="aboutme-photo"
            />
          </div>

          <div className="aboutme-intro fade-in-right">

            <span className="section-label">
              About Me
            </span>

            <h1 className="aboutme-name">
              Hi, I'm Oscar
              <span style={{ color: "var(--color-accent)" }}>
                .
              </span>
            </h1>

            <p className="aboutme-tagline">
              Artificial Intelligence Engineer focused on building reliable AI
              systems—from scalable data infrastructure to intelligent
              applications. I enjoy combining first-principles thinking,
              disciplined engineering, and continuous experimentation to
              transform ambitious ideas into production-ready solutions.
            </p>

            <ul className="aboutme-facts">
              <li>Based in {profile.location}</li>
              <li>🇲🇽 Spanish (Native) · 🇺🇸 English (Professional)</li>
              <li>Python · Scala · Spark · AWS · Machine Learning</li>
            </ul>

            <div className="aboutme-cta">
              <a href="/#portfolio" className="btn btn-primary">
                Explore my work →
              </a>

              <a href="/#contact" className="btn btn-outline">
                Get in touch
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* MISSION */}

      <section className="aboutme-section">
        <div className="container aboutme-prose">

          <span className="section-label">
            Mission
          </span>

          <h2 className="section-title">
            Why I Build
          </h2>

          <p>
            My goal is to build AI systems that are technically rigorous,
            responsibly designed, and capable of creating meaningful impact at
            scale. I believe the future of Artificial Intelligence depends not
            only on better models, but on thoughtful engineering, reliable
            infrastructure, and people willing to question assumptions while
            continuously learning.
          </p>

        </div>
      </section>

      {/* JOURNEY */}

      <section className="aboutme-section alt-bg">

        <div className="container aboutme-prose">

          <span className="section-label">
            My Journey
          </span>

          <h2 className="section-title">
            Curiosity became a career
          </h2>

          <p>
            I have always been fascinated by understanding how complex systems
            work—not simply using them, but rebuilding them until I understand
            every decision behind their design. That curiosity eventually led me
            to study Artificial Intelligence Engineering at ESCOM-IPN, where I
            discovered the intersection of mathematics, software engineering,
            and intelligent systems.
          </p>

          <p>
            During my academic and professional journey, I realized that modern
            AI depends on much more than training models. Reliable data,
            scalable infrastructure, software architecture, and disciplined
            engineering are what transform promising research into products that
            people can trust.
          </p>

          <p>
            That realization naturally led me from full-stack development into
            data engineering, where I learned how production systems ingest,
            process, and serve data at scale. Along the way I continued
            expanding into machine learning, computer vision, retrieval systems,
            and generative AI.
          </p>

          <p>
            Today I work as a Data Engineer while continuously exploring new AI
            technologies through personal research and side projects. One of my
            favorite projects has been developing a Retrieval-Augmented
            Generation assistant powered by public government data, combining
            scalable data pipelines, semantic search, and language models to
            make complex information easier to access.
          </p>

        </div>

      </section>

      {/* PHILOSOPHY */}

      <section className="aboutme-section">

        <div className="container aboutme-prose">

          <span className="section-label">
            Engineering Philosophy
          </span>

          <h2 className="section-title">
            How I Think
          </h2>

          <p>
            Great engineering starts with understanding fundamentals before
            reaching for complexity. Elegant systems rarely emerge from clever
            shortcuts—they are the result of clear thinking, careful
            experimentation, and relentless iteration.
          </p>

          <p>
            I don't want to simply use AI tools—I want to understand how they
            work, why they succeed, and where they fail. That mindset drives me
            to reproduce ideas from research papers, implement algorithms from
            scratch, and continuously question my own assumptions.
          </p>

        </div>

      </section>

      {/* PRINCIPLES */}

      <section className="aboutme-section alt-bg">

        <div className="container">

          <span className="section-label">
            Core Principles
          </span>

          <h2 className="section-title">
            Values that guide my work
          </h2>

          <div className="aboutme-values">

            {principles.map((item) => (

              <div
                key={item.title}
                className="aboutme-value-card fade-in"
              >

                <h3>{item.title}</h3>

                <p>{item.text}</p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* WORKING STYLE */}

      <section className="aboutme-section">

        <div className="container">

          <span className="section-label">
            Working Style
          </span>

          <h2 className="section-title">
            How I approach engineering
          </h2>

          <div className="aboutme-values">

            {workingStyle.map((item) => (

              <div
                key={item.title}
                className="aboutme-value-card fade-in"
              >

                <h3>{item.title}</h3>

                <p>{item.text}</p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* INTERESTS */}

      <section className="aboutme-section alt-bg">

        <div className="container">

          <span className="section-label">
            Beyond Engineering
          </span>

          <h2 className="section-title">
            Curiosity doesn't stop at work
          </h2>

          <div className="aboutme-interests">

            {interests.map((item) => (

              <div
                key={item.title}
                className="aboutme-interest-card fade-in"
              >

                <h3>{item.title}</h3>

                <p>{item.text}</p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* CURRENT INTERESTS */}

      <section className="aboutme-section">

        <div className="container">

          <span className="section-label">
            Currently Exploring
          </span>

          <h2 className="section-title">
            Topics that inspire me
          </h2>

          <div className="skills-grid">

            {technologies.map((item) => (

              <span
                key={item}
                className="skill-chip"
              >
                {item}
              </span>

            ))}

          </div>

        </div>

      </section>

      {/* LOOKING AHEAD */}

      <section className="aboutme-section alt-bg">

        <div className="container aboutme-prose">

          <span className="section-label">
            Looking Ahead
          </span>

          <h2 className="section-title">
            Where I'm Going
          </h2>

          <p>
            My long-term goal is to contribute to the next generation of
            intelligent systems by combining scalable infrastructure, machine
            learning, and thoughtful product engineering. I aspire to become an
            AI Research Engineer and technical leader, working alongside
            world-class researchers and engineers to transform cutting-edge
            ideas into technologies that are reliable, responsible, and capable
            of improving millions of lives.
          </p>

          <p>
            Above all, I hope never to lose the curiosity that brought me here.
            Technology will continue to evolve, but the mindset of asking better
            questions, learning continuously, and building with integrity will
            always remain at the center of the engineer I want to become.
          </p>

        </div>

      </section>

      <Footer {...siteProps} />

    </div>
  );
};

export default AboutMePage;