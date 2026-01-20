import React, { useEffect } from "react";
import { Project } from "./ProjectCard";

interface Props {
  project: Project;
  onClose: () => void;
}

const ProjectModal: React.FC<Props> = ({ project, onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

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
        <h2 className="text-3xl font-bold mb-4">{project.title}</h2>

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
          className="mt-4 bg-blue-500 px-6 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ProjectModal;

