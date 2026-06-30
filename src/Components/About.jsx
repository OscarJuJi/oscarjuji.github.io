import React from "react";

const description =
  "I'm an Artificial Intelligence Engineering student at ESCOM–IPN. I enjoy building intelligent systems with versatile real-world applications — from NLP pipelines and computer vision models to full-stack platforms. I strive to bridge the gap between research and practical AI solutions.";

const quote =
  "Passionate about solving problems in creative and efficient ways. I always seek challenges that allow me to enhance my skills in artificial intelligence and software engineering.";

const skillsList = [
  { name: "Artificial Intelligence", icon: "https://img.icons8.com/color/100/artificial-intelligence.png" },
  { name: "Machine Learning", icon: "https://img.icons8.com/?size=100&id=oOOSYZyuA844&format=png&color=000000" },
  { name: "NLP", icon: "https://img.icons8.com/?size=100&id=sop9ROXku5bb&format=png&color=000000" },
  { name: "Computer Vision", icon: "https://img.icons8.com/?size=100&id=bpip0gGiBLT1&format=png&color=000000" },
  { name: "PyTorch", icon: "https://img.icons8.com/?size=100&id=jH4BpkMnRrU5&format=png&color=000000" },
  { name: "OpenAI API", icon: "https://img.icons8.com/?size=100&id=ka3InxFU3QZa&format=png&color=000000" },
  { name: "Python", icon: "https://img.icons8.com/color/100/python.png" },
  { name: "Google Cloud", icon: "https://img.icons8.com/color/100/google-cloud.png" },
  { name: "Azure ML", icon: "https://img.icons8.com/color/100/azure-1.png" },
  { name: "Docker", icon: "https://img.icons8.com/color/100/docker.png" },
  { name: "FastAPI", icon: "https://img.icons8.com/?size=100&id=21888&format=png&color=000000" },
  { name: "Django", icon: "https://img.icons8.com/color/100/django.png" },
  { name: "React", icon: "https://img.icons8.com/color/100/react-native.png" },
  { name: "Node.js", icon: "https://img.icons8.com/color/100/nodejs.png" },
  { name: "TypeScript", icon: "https://img.icons8.com/color/100/typescript.png" },
  { name: "HTML/CSS/JS", icon: "https://img.icons8.com/color/100/html-5--v1.png" },
  { name: "Java", icon: "https://img.icons8.com/color/100/java-coffee-cup-logo--v1.png" },
  { name: "C++", icon: "https://img.icons8.com/color/100/c-plus-plus-logo.png" },
  { name: "C#", icon: "https://img.icons8.com/color/100/c-sharp-logo.png" },
  { name: "MATLAB", icon: "https://img.icons8.com/?size=100&id=r5Y16PcDkoWI&format=png&color=000000" },
  { name: "Oracle SQL", icon: "https://img.icons8.com/color/100/oracle-logo.png" },
  { name: "Data Science", icon: "https://img.icons8.com/?size=100&id=xSkewUSqtErH&format=png&color=000000" },
  { name: "PowerBI", icon: "https://img.icons8.com/color/100/power-bi.png" },
  { name: "Git", icon: "https://img.icons8.com/color/100/git.png" },
  { name: "GitHub", icon: "https://img.icons8.com/fluency/100/github.png" },
  { name: "REST APIs", icon: "https://img.icons8.com/color/100/api.png" },
  { name: "Visual Studio", icon: "https://img.icons8.com/?size=100&id=ezj3zaVtImPg&format=png&color=000000" },
];

const stats = [
  { number: "6+", label: "Projects Completed", emoji: "🚀" },
  { number: "28+", label: "Technologies", emoji: "⚡" },
  { number: "6mo", label: "Industry Experience", emoji: "💼" },
  { number: "4+", label: "Certifications", emoji: "🏆" },
];

const About = () => (
  <>
    <section id="about" className="about-section">
      <div className="container">
        <div className="about-grid">
          <div className="about-text">
            <span className="section-label fade-in">About Me</span>
            <h2 className="section-title fade-in delay-1">Who I Am</h2>
            <p className="fade-in delay-2">{description}</p>
            <blockquote className="about-quote fade-in delay-3">{quote}</blockquote>
          </div>

          <div className="stat-cards">
            {stats.map((s, i) => (
              <div key={s.label} className={`stat-card fade-in delay-${i + 1}`}>
                <span className="stat-card-emoji">{s.emoji}</span>
                <span className="stat-card-number">{s.number}</span>
                <span className="stat-card-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="skills-section">
      <div className="container">
        <span className="section-label fade-in">Technical Skills</span>
        <h2 className="section-title fade-in delay-1">Tools &amp; Technologies</h2>
        <p className="section-subtitle fade-in delay-2">
          A broad toolkit spanning AI/ML research, cloud infrastructure, and full-stack development.
        </p>
        <div className="skills-grid">
          {skillsList.map((skill, i) => (
            <div key={skill.name} className="skill-card fade-in" style={{ transitionDelay: `${(i % 8) * 0.05}s` }}>
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
