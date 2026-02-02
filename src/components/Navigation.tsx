import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Code } from "lucide-react"; // Using a small icon as part of logo
import { useLocation } from "react-router-dom";

const Navigation: React.FC = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);

      const sections = ["home", "about", "skills", "portfolio"];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 120) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/", id: "home" },
    { name: "About", href: "/#about", id: "about" },
    { name: "Skills", href: "/#skills", id: "skills" },
    { name: "Projects", href: "/#portfolio", id: "portfolio" },
    { name: "Contact", href: "/contact", id: "contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`sticky top-0 z-50 backdrop-blur-lg transition-all ${
        scrolled ? "bg-gray-900/80 shadow-xl" : "bg-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo with gradient and icon */}
        <motion.a
          href="/"
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <Code className="w-6 h-6 text-yellow-400" />
          <span className="text-2xl font-extrabold bg-gradient-to-r from-yellow-400 to-purple-500 bg-clip-text text-transparent">
            Portfolio
          </span>
        </motion.a>

        {/* Nav Links */}
        <div className="flex gap-8">
          {navLinks.map((link) => {
            const isActive =
              (location.pathname === "/" && link.id === "home") ||
              (location.pathname === "/contact" && link.id === "contact") ||
              (location.pathname === "/" && activeSection === link.id);

            return (
              <motion.a
                key={link.id}
                href={link.href}
                whileHover={{ y: -2 }}
                className={`relative font-semibold transition-colors ${
                  isActive
                    ? "text-yellow-400"
                    : "text-gray-300 hover:text-yellow-400"
                }`}
              >
                {link.name}
                {/* Animated underline */}
                {isActive && (
                  <motion.span
                    layoutId="activeLink"
                    className="absolute left-0 -bottom-2 h-0.5 w-full bg-yellow-400 rounded"
                  />
                )}
              </motion.a>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
