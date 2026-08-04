import { useState, useEffect } from "react";

/**
 * Dark-mode state synced to localStorage and the document's `data-theme`
 * attribute. Shared by every page so the theme persists across navigations
 * (the anti-flash <script> in each HTML head reads the same localStorage key).
 *
 * @returns {[boolean, () => void]} [darkMode, toggle]
 */
export const useDarkMode = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    // Dark is the default. The site is a night city; daylight is the variant.
    // A visitor's own choice still wins — this only decides the first load.
    return true;
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return [darkMode, () => setDarkMode((d) => !d)];
};

/**
 * Global scroll-reveal: adds `.visible` to every `.fade-in*` element as it
 * scrolls into view. Runs once on mount; safe on any page that uses the
 * `.fade-in` / `.fade-in-left` / `.fade-in-right` classes.
 */
export const useScrollReveal = () => {
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
        .querySelectorAll(
          ".fade-in:not(.visible), .fade-in-left:not(.visible), .fade-in-right:not(.visible)"
        )
        .forEach((el) => observer.observe(el));
    };

    // Initial scan after mount
    const t = setTimeout(scan, 80);
    return () => {
      clearTimeout(t);
      observer.disconnect();
    };
  }, []);
};
