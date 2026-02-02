import React, { useEffect, useState } from "react";
import { Project } from "./ProjectCard";

interface Props {
  project: Project;
  onClose: () => void;
}

const ProjectModal: React.FC<Props> = ({ project, onClose }) => {
  const [imageOpen, setImageOpen] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (imageOpen) setImageOpen(false);
        else onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose, imageOpen]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900 max-w-3xl w-full rounded-xl p-8 border border-gray-800"
      >
        {project.image && (
          <div className="mb-6 rounded-md overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              onClick={() => setImageOpen(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setImageOpen(true);
              }}
              className="w-full h-64 object-cover rounded-md cursor-zoom-in"
            />
          </div>
        )}

        <h2 className="text-3xl font-bold mb-4">{project.title}</h2>

        {imageOpen && (
          <div
            className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setImageOpen(false)}
            role="dialog"
            aria-modal="true"
          >
            <img
              src={project.image}
              alt={project.title}
              className="max-w-full max-h-[90vh] object-contain rounded-md shadow-xl cursor-zoom-out"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
        <p className="text-gray-300 mb-6">{project.description}</p>

        {project.highlights && (
          <ul className="list-disc list-inside text-gray-400 mb-6 space-y-1">
            {project.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        )}

        <button
          onClick={onClose}
          className="mt-4 bg-yellow-500 px-6 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ProjectModal;
