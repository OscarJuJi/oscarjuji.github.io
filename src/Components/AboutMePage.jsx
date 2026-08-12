import React from "react";
import PropTypes from "prop-types";

import Header from "./Header";
import Footer from "./Footer";
import { profile, siteProps } from "../site-data.mjs";
import { useDarkMode, useScrollReveal } from "../hooks";
import photo from "../images/profile.png";
import "../styles.css";

// What I hold to when the tradeoff is real and nobody is watching.
const principles = [
  {
    title: "Reason from first principles",
    text: "I rebuild things that already exist to find out what they are actually doing. Writing a transformer in NumPy — the backward pass derived by hand, checked against finite differences — taught me more about attention than any diagram, and it is why I can tell when a library is the wrong tool rather than merely a slow one.",
  },
  {
    title: "Simple until it proves insufficient",
    text: "Reaching for the sophisticated method first is usually a way of postponing the work of understanding the problem. I start with the plainest thing that could work, find where it breaks, and let that failure argue for the complexity instead of assuming it up front.",
  },
  {
    title: "Own the outcome",
    text: "A model is not finished when it converges. Something has to feed it, watch it, and decide what happens when it is wrong. My trading agent runs behind limits it cannot reason its way past, because the failures worth designing for live at the edges, not in the average case.",
  },
  {
    title: "Stay a beginner on purpose",
    text: "The field moves faster than my intuitions do, so I keep testing them. I read the paper, then implement the part I am least sure I understood — that is usually where my mental model turns out to be wrong.",
  },
  {
    title: "Say the difficult part first",
    text: "I work in Spanish and English across teams that rarely share the same context. It taught me to lead with the risk or the disagreement instead of burying it three polite paragraphs down, and to want the same directness back.",
  },
];

// How the principles actually show up in a working week.
const workingStyle = [
  {
    title: "Ask why before how",
    text: "A fix I cannot explain is a fix I do not trust. Understanding the cause takes longer than patching the symptom and saves the week I would otherwise spend meeting it again.",
  },
  {
    title: "Let the tests carry the argument",
    text: "A claim about behaviour is worth what its test is worth. Mine assert the false positives too: the search on this site fails if the query “net” ever starts matching “genetic” again, because once it did.",
  },
  {
    title: "Prototype to learn, not to impress",
    text: "The fastest way to settle a disagreement about a design is to build the smallest version that could disprove it. Several of my side projects began as an argument I wanted to end.",
  },
  {
    title: "Treat review as measurement",
    text: "Someone finding a hole in my reasoning is cheaper than production finding it. I would rather be corrected early than be right late.",
  },
];

// The part of me that is not an engineer, and keeps the engineer working.
const interests = [
  {
    title: "Research and reading",
    text: "Language models, retrieval and multimodal systems — mostly to keep track of which of my assumptions have quietly expired.",
  },
  {
    title: "Side projects",
    text: "Weekends turn into prototypes: retrieval-augmented systems, autonomous agents, computer vision. They are where I get to be wrong cheaply.",
  },
  {
    title: "Cooking",
    text: "A discipline with a tight feedback loop and no way to fake the result. Small adjustments compound, and the failures are edible.",
  },
  {
    title: "Time with my dog",
    text: "The most reliable way I know to stop turning a problem over. Solutions tend to show up somewhere in the second half of the walk.",
  },
  {
    title: "Strength training",
    text: "Progress there comes from showing up consistently rather than going hard once. That lesson transferred more directly to engineering than I expected.",
  },
  {
    title: "Strategy games",
    text: "Chess, and anything that rewards reading a position several moves out. Good practice for choosing between options that all look reasonable today.",
  },
];

const technologies = [
  "Large Language Models",
  "Retrieval-Augmented Generation",
  "AI Agents",
  "Model Evaluation",
  "Computer Vision",
  "Multimodal Systems",
  "Distributed Data Processing",
  "MLOps",
  "AI Safety",
];

const Section = ({ label, title, containerClass, children }) => (
  <section className="aboutme-section">
    <div className={`container${containerClass ? ` ${containerClass}` : ""}`}>
      <span className="section-label fade-in">{label}</span>
      <h2 className="section-title fade-in delay-1">{title}</h2>
      {children}
    </div>
  </section>
);

Section.defaultProps = { containerClass: "" };

Section.propTypes = {
  label: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  containerClass: PropTypes.string,
  children: PropTypes.node.isRequired,
};

const CardGrid = ({ items, className }) => (
  <div className={className}>
    {items.map((item) => (
      <div key={item.title} className="aboutme-value-card fade-in">
        <h3>{item.title}</h3>
        <p>{item.text}</p>
      </div>
    ))}
  </div>
);

CardGrid.defaultProps = { className: "aboutme-values" };

CardGrid.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({ title: PropTypes.string, text: PropTypes.string }))
    .isRequired,
  className: PropTypes.string,
};

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
            <img src={photo} alt={profile.fullName} className="aboutme-photo" />
          </div>

          <div className="aboutme-intro fade-in-right">
            <span className="section-label">Who I Am</span>
            <h1 className="aboutme-name">
              Hi, I&apos;m Oscar<span style={{ color: "var(--color-accent)" }}>.</span>
            </h1>
            <p className="aboutme-tagline">
              I&apos;ve been curious for as long as I can remember. When I was a teenager I was
              already drawn to engineering, and I followed that interest into two technical degrees:
              one in electricity and another in automated machinery. The academic side is what
              really drives me — I love learning for its own sake. One field in particular has
              always pulled at me is health and psychology. Outside of that, my hobbies have been the
              same since I was a kid, the music, both listening and playing, and video games. I&apos;ve
              lived in Iztapalapa my whole life, and now I want to explore the world.
            </p>
            <ul className="aboutme-facts">
              <li>Based in {profile.location}</li>
              <li>Spanish (native) · English (professional)</li>
              <li>Python daily; C, C++ and MATLAB when the problem asks for them</li>
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

      <Section label="Mission" title="Why I build" containerClass="aboutme-prose">
        <p className="fade-in delay-2">
          I want to work on intelligent systems that hold up outside the notebook they were born in.
          Better models are only part of that. The rest is unglamorous: data you can account for,
          infrastructure that fails loudly, evaluation honest enough to tell you when the thing you
          shipped is worse than what it replaced. I would rather spend a career on that half of the
          problem than on the demo.
        </p>
      </Section>

      <Section label="My Journey" title="How I got here" containerClass="aboutme-prose">
        <p className="fade-in delay-2">
          I studied Artificial Intelligence Engineering at ESCOM–IPN in Mexico City. What held my
          attention was never the models themselves but the distance between a method that works in
          a paper and one that survives contact with real data. That gap is where most of the
          engineering actually lives, and almost none of the coursework goes.
        </p>
        <p className="fade-in delay-2">
          So I approached it from underneath. I started in full-stack development, moved into data
          engineering, and now build ETL pipelines on distributed clusters feeding a bank&apos;s
          core data infrastructure — an environment where a silent failure is far worse than a loud
          one. Working below the models taught me something training them never would have: most of
          what makes a system trustworthy is decided long before inference.
        </p>
        <p className="fade-in delay-3">
          The projects I am proudest of come from the same instinct. I built a retrieval-augmented
          assistant over Mexico&apos;s official gazette, turning a daily wall of legal text into
          something a person can actually query. Later I rewrote the idea from scratch in NumPy —
          perceptron, GRU and transformer, backpropagation derived by hand and verified numerically
          — because a gradient that looks right and a gradient that is right are two different
          claims.
        </p>
      </Section>

      <Section label="Core Principles" title="What guides the work">
        <CardGrid items={principles} />
      </Section>

      <Section label="Working Style" title="How I approach engineering">
        <CardGrid items={workingStyle} />
      </Section>

      <Section label="Beyond Engineering" title="What I like to do in my freetime">
        <CardGrid items={interests} />
      </Section>

      <Section label="Looking Ahead" title="Where I’m going" containerClass="aboutme-prose">
        <p className="fade-in delay-2">
          I want to keep moving toward research engineering: close enough to the science to
          understand why a method works, close enough to production to be accountable when it does
          not. The teams I want to join are the ones where being shown you were wrong counts as
          progress rather than a loss.
        </p>
        <p className="fade-in delay-3">
          What I hope not to lose is the part that got me here — the reflex to open something up and
          find out how it works, even when using it would have been enough.
        </p>
      </Section>

      <Footer {...siteProps} />
    </div>
  );
};

export default AboutMePage;
