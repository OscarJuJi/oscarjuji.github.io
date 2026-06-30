import React, { useState } from "react";
import PropTypes from "prop-types";

const Contact = ({ email }) => {
  const [form, setForm] = useState({ name: "", senderEmail: "", subject: "", message: "" });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, senderEmail, subject, message } = form;
    const mailSubject = encodeURIComponent(subject || `Portfolio inquiry from ${name}`);
    const mailBody = encodeURIComponent(
      `Hi Oscar,\n\n${message}\n\n—\n${name}\n${senderEmail}`
    );
    window.location.href = `mailto:${email}?subject=${mailSubject}&body=${mailBody}`;
  };

  const contactLinks = [
    {
      icon: "📧",
      label: email,
      href: `mailto:${email}`,
    },
    {
      icon: "💼",
      label: "linkedin.com/in/oscar-antonio-juarez-jimenez-7979a6287",
      href: "https://www.linkedin.com/in/oscar-antonio-juarez-jimenez-7979a6287",
    },
    {
      icon: "🐙",
      label: "github.com/OscarJuJi",
      href: "https://github.com/OscarJuJi",
    },
    {
      icon: "📸",
      label: "instagram.com/Oscar_JuJi",
      href: "https://www.instagram.com/Oscar_JuJi",
    },
  ];

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="contact-grid">
          <div>
            <span className="section-label fade-in">Get In Touch</span>
            <h2 className="section-title fade-in delay-1">Let&apos;s Work Together</h2>
            <p className="contact-info-text fade-in delay-2">
              Whether you have an exciting AI project, an internship opportunity, or just want to
              say hello — my inbox is always open.
            </p>

            <div className="contact-links fade-in delay-3">
              {contactLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target={item.href.startsWith("mailto") ? undefined : "_blank"}
                  rel={item.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                  className="contact-link-item"
                >
                  <span className="contact-link-icon">{item.icon}</span>
                  <span style={{ wordBreak: "break-all", fontSize: "0.875rem" }}>{item.label}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="fade-in delay-2">
            <form className="contact-form-card" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="contact-name">Name</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-email">Email</label>
                  <input
                    id="contact-email"
                    name="senderEmail"
                    type="email"
                    placeholder="your@email.com"
                    value={form.senderEmail}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="contact-subject">Subject</label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  placeholder="What is this about?"
                  value={form.subject}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="Tell me about your project or opportunity..."
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary form-submit">
                Send Message →
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

Contact.propTypes = {
  email: PropTypes.string.isRequired,
};

export default Contact;
