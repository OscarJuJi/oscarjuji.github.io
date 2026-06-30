import React from "react";
import PropTypes from "prop-types";

import envelopeIcon from "../images/socials/envelope.svg";
import gitHubIcon from "../images/socials/github.svg";
import instagramIcon from "../images/socials/instagram.svg";
import linkedInIcon from "../images/socials/linkedin.svg";

const Footer = ({ name, email, gitHub, instagram, linkedIn }) => {
  const socials = [
    { show: email, href: `mailto:${email}`, icon: envelopeIcon, alt: "Email" },
    { show: gitHub, href: `https://github.com/${gitHub}`, icon: gitHubIcon, alt: "GitHub" },
    { show: linkedIn, href: `https://www.linkedin.com/in/${linkedIn}`, icon: linkedInIcon, alt: "LinkedIn" },
    { show: instagram, href: `https://www.instagram.com/${instagram}`, icon: instagramIcon, alt: "Instagram" },
  ].filter((s) => s.show);

  return (
    <footer id="footer" className="footer">
      <div className="footer-inner">
        <div className="footer-brand">{name.split(" ")[0]}<span style={{ color: "var(--color-accent)" }}>.</span></div>
        <p className="footer-tagline">AI Engineer &amp; Full Stack Developer</p>

        <div className="footer-socials">
          {socials.map((s) => (
            <a
              key={s.alt}
              href={s.href}
              target={s.href.startsWith("mailto") ? undefined : "_blank"}
              rel={s.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
              className="footer-social-link"
              aria-label={s.alt}
            >
              <img src={s.icon} alt={s.alt} />
            </a>
          ))}
        </div>

        <div className="footer-divider" />
        <p className="footer-copyright">
          &copy; {new Date().getFullYear()} {name} &mdash; Built with React
        </p>
      </div>
    </footer>
  );
};

Footer.defaultProps = {
  devDotTo: "",
  medium: "",
  twitter: "",
  youTube: "",
};

Footer.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string,
  gitHub: PropTypes.string,
  instagram: PropTypes.string,
  linkedIn: PropTypes.string,
};

export default Footer;
