import React from "react";

import About from "./Components/About";
import AIChat from "./Components/AIChat";
import Contact from "./Components/Contact";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import Home from "./Components/Home";
import Portfolio from "./Components/Portfolio";
import Education from "./Components/Education";
import ProfessionalExperience from "./Components/ProfessionalExperience";
import { siteProps } from "./site-data.mjs";
import { useDarkMode, useScrollReveal } from "./hooks";
import "./styles.css";

const App = () => {
  const [darkMode, toggleDark] = useDarkMode();
  useScrollReveal();

  return (
    <div id="main">
      <Header darkMode={darkMode} onToggleDark={toggleDark} />
      <Home name={siteProps.name} title={siteProps.title} />
      <About />
      <Education />
      <ProfessionalExperience />
      <Portfolio />
      <Contact email={siteProps.email} />
      <Footer {...siteProps} />
      <AIChat />
    </div>
  );
};

export default App;
