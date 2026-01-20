


import { motion } from "framer-motion";


import React from "react";

export interface Project {
  id: number;
  slug: string; // ✅ SEO-friendly identifier
  title: string;
  description: string;
  image: string;
  technologies: string[];
  link: string;

  // Optional extended details
  role?: string;
  year?: string;
  status?: "Completed" | "In Progress" | "Prototype";
  highlights?: string[];
  github?: string;
}

interface ProjectCardProps {
  project: Project;
  onProjectClick: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onProjectClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
     className="group bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/40 transition transform hover:scale-[1.02]"
>
      <div className="relative">
       <img
  src={project.image}
  alt={project.title}
  className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
/>


        {project.status && (
          <span className="absolute top-4 right-4 bg-black/70 text-xs px-3 py-1 rounded-full border border-gray-700">
            {project.status}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title + Meta */}
        <div>
          <h3 className="text-2xl font-bold">{project.title}</h3>

          {(project.role || project.year) && (
            <p className="text-sm text-gray-400 mt-1">
              {project.role && <span>{project.role}</span>}
              {project.role && project.year && " • "}
              {project.year && <span>{project.year}</span>}
            </p>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm leading-relaxed">
          {project.description}
        </p>

        {/* Highlights */}
        {project.highlights && project.highlights.length > 0 && (
          <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
            {project.highlights.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 pt-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-xs border border-blue-500/30"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4">
          <button
            onClick={() => onProjectClick(project)}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-sm font-medium transition"
          >
            View Details
          </button>

          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-white transition"
            >
              GitHub →
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
