import React from "react";

const educationList = [
  {
    date: "2021 – Jun 2025",
    title: "Artificial Intelligence Engineering",
    institution: "Escuela Superior de Cómputo (ESCOM) · IPN",
    description:
      "Degree focused on machine learning models, deep learning algorithms, computer vision, NLP, and software engineering. Developed strong soft skills including teamwork, assertive communication, and personal leadership.",
  },
  {
    date: "2023",
    title: "Google Cloud Career Launchpad",
    institution: "Google Cloud",
    description:
      "Completed the Google Cloud Computing Foundations Certificate and the Beginner: Introduction to Generative AI Learning Path. Gained knowledge in cloud architecture, infrastructure, GCP services, neural networks, NLP, and image generation.",
  },
  {
    date: "2023",
    title: "Microsoft Learn AI Skills Challenge",
    institution: "Microsoft",
    description:
      "Obtained insights into Microsoft Azure cloud services with a focus on Machine Learning and Cognitive Services. Expanded understanding of the lifecycle and documentation processes for AI models.",
  },
  {
    date: "2022",
    title: "Oracle Next Education",
    institution: "Oracle",
    description:
      "Acquired essential skills spanning programming logic, front-end and back-end development, and entrepreneurship through Oracle's sponsored program.",
  },
];

const Education = () => (
  <section id="education" className="timeline-section alt-bg">
    <div className="container">
      <span className="section-label fade-in">Academic Background</span>
      <h2 className="section-title fade-in delay-1">Education</h2>
      <p className="section-subtitle fade-in delay-2">
        Formal studies and certifications that shaped my technical foundation.
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
