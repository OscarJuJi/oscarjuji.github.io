import React, { useState, useEffect } from "react";

import About from "./Components/About";
import Contact from "./Components/Contact";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import Home from "./Components/Home";
import Portfolio from "./Components/Portfolio";
import Education from "./Components/Education";
import ProfessionalExperience from "./Components/ProfessionalExperience";
import "./styles.css";

const siteProps = {
  name: "Oscar Antonio Juarez",
  title: "Full Stack Developer & Artificial Intelligence Engineer",
  email: "oscar.a.juarez.j@gmail.com",
  gitHub: "OscarJuJi",
  instagram: "Oscar_JuJi",
  linkedIn: "oscar-antonio-juarez-jimenez-7979a6287",
  medium: "",
  twitter: "",
  youTube: "",
};

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Global scroll-reveal: observe all .fade-in* elements once mounted
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    const scan = () => {
      document
        .querySelectorAll(".fade-in:not(.visible), .fade-in-left:not(.visible), .fade-in-right:not(.visible)")
        .forEach((el) => observer.observe(el));
    };

    // Initial scan after mount
    const t = setTimeout(scan, 80);
    return () => {
      clearTimeout(t);
      observer.disconnect();
    };
  }, []);

  return (
    <div id="main">
      <Header darkMode={darkMode} onToggleDark={() => setDarkMode((d) => !d)} />
      <Home name={siteProps.name} title={siteProps.title} />
      <About />
      <Education />
      <ProfessionalExperience />
      <Portfolio />
      <Contact email={siteProps.email} />
      <Footer {...siteProps} />
    </div>
  );
};

export default App;
