import React from "react";
import { motion } from "framer-motion";

const Hero: React.FC = () => {
  return (
    <section
      id="home"
      className="relative max-w-6xl mx-auto px-4 py-28 text-center overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-yellow-500/10 via-transparent to-transparent" />

      {/* Profile */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-10 flex justify-center"
      >
        <div className="relative">
          <img
            src="/Facebook.jpg"
            alt="Profile photo of frontend developer"
            className="w-40 h-40 rounded-full object-cover border-4 border-yellow-400 shadow-xl shadow-yellow-500/30"
          />
          <span className="absolute bottom-2 right-2 bg-green-500 text-xs px-2 py-1 rounded-full">
            Open to Work
          </span>
        </div>
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-5xl md:text-6xl font-extrabold mb-6"
      >
        Junior{" "}
        <span className="bg-gradient-to-r from-yellow-400 to-purple-500 bg-clip-text text-transparent">
          Frontend Developer
        </span>
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-xl text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed"
      >
        I’m a junior frontend developer who loves building responsive and
        user-friendly web apps. I work with React, TypeScript, Tailwind CSS, and
        Docker, and I’m looking for an internship where I can grow, learn, and
        build real-world products with a great team.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex justify-center gap-4"
      >
        <a
          href="#portfolio"
          className="bg-yellow-500 hover:bg-yellow-600 px-8 py-3 rounded-lg font-semibold transition transform hover:scale-105"
        >
          View Projects
        </a>
        <a
          href="#contact"
          className="border border-gray-600 px-8 py-3 rounded-lg hover:border-yellow-400"
        >
          Contact
        </a>
        <a
          href="/cv.pdf"
          download
          className="border border-yellow-500 text-yellow-400 px-8 py-3 rounded-lg hover:bg-yellow-500 hover:text-white transition"
        >
          Download CV
        </a>
      </motion.div>
    </section>
  );
};

export default Hero;
