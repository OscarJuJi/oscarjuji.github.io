import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { SunIcon, MoonIcon } from "./Icons";
import logo from "../images/icon.webp";

// Portfolio sections live on the index page. `linkBase` lets the same nav
// work from another page: "" keeps in-page hash links (#about); "/" turns
// them into cross-page links (/#about) that jump back to the portfolio.
const sectionLinks = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "education", label: "Education" },
  { id: "experience", label: "Experience" },
  { id: "portfolio", label: "Projects" },
  { id: "contact", label: "Contact" },
];

const Header = ({ darkMode, onToggleDark, linkBase }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    ...sectionLinks.map((l) => ({ href: `${linkBase}#${l.id}`, label: l.label })),
    { href: `${linkBase}about.html`, label: "Who I Am" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <header className={`header${scrolled ? " scrolled" : ""}`}>
        <div className="header-inner">
          <a href={`${linkBase}#home`} className="header-logo">
            <img src={logo} alt="icon" className="header-logo-img" />
          </a>

          <nav className="nav-links" aria-label="Primary navigation">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <button
              className="theme-toggle"
              onClick={onToggleDark}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              title={darkMode ? "Light mode" : "Dark mode"}
            >
              {darkMode ? <SunIcon size={17} /> : <MoonIcon size={16} />}
            </button>

            <button
              className="hamburger"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <nav
        className={`mobile-nav${mobileOpen ? " open" : ""}`}
        aria-label="Mobile navigation"
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </>
  );
};

Header.defaultProps = {
  linkBase: "",
};

Header.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  onToggleDark: PropTypes.func.isRequired,
  linkBase: PropTypes.string,
};

export default Header;
