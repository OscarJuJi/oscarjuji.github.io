import React from "react";

const educationList = [
  {
    date: "Aug 2021 – Jul 2025",
    title: "B.Sc. Artificial Intelligence Engineering · GPA 9.5 / 10",
    institution: "Escuela Superior de Cómputo (ESCOM) · IPN — Mexico City",
    description:
      "Focused on machine learning, deep learning, computer vision, NLP, bio-inspired algorithms, and software engineering for intelligent systems. Relevant coursework: Machine Learning, Digital Image Processing, Natural Language Technologies, Neural Networks & Deep Learning, Advanced Neural Networks, Software Engineering for Intelligent Systems, Parallel Computing, Bio-Inspired Algorithms.",
  },
  {
    date: "2024 – Present",
    title: "AWS Certified Data Engineer – Associate (In Progress)",
    institution: "Amazon Web Services",
    description:
      "Preparing for the AWS Data Engineer – Associate certification, covering data pipelines, storage, processing, and security on AWS infrastructure.",
  },
  {
    date: "2025",
    title: "SAFe Scrum Master · AWS Technical Essentials · Jira Scrum Team",
    institution: "Scaled Agile · Amazon Web Services · Atlassian",
    description:
      "Completed agile project management training (SAFe Scrum Master), foundational AWS cloud services (AWS Technical Essentials), and Jira workflow configuration for Scrum teams.",
  },
  {
    date: "2024",
    title: "Secure Development 3.0 · FreeCodeCamp Certifications",
    institution: "Net4skills · FreeCodeCamp",
    description:
      "Secure software development practices (Net4skills). FreeCodeCamp certifications in Legacy Responsive Web Design, Legacy Python for Everybody, and JavaScript Algorithms & Data Structures.",
  },
  {
    date: "2023",
    title: "Google Cloud Computing Foundations · GenAI Skill Badge Pathways",
    institution: "Google Cloud",
    description:
      "Earned the Google Cloud Computing Foundations Certificate and the Beginner: Introduction to Generative AI Learning Path, covering cloud architecture, GCP services, neural networks, NLP, and image generation.",
  },
  {
    date: "2023",
    title: "Microsoft Learn AI Skills Challenge (Azure)",
    institution: "Microsoft",
    description:
      "Obtained insights into Azure cloud services with a focus on Machine Learning, Cognitive Services, and the lifecycle of AI models.",
  },
  {
    date: "2022",
    title: "Oracle Next Education",
    institution: "Oracle · Alura LATAM",
    description:
      "Acquired skills in programming logic, front-end and back-end development, and entrepreneurship through Oracle's sponsored training program.",
  },
];

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
