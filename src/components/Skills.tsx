import React from "react";

const Skills: React.FC = () => {
  const skillCategories = [
    {
      category: "Frontend",
      skills: ["React", "TypeScript", "Tailwind CSS", "HTML/CSS", "JavaScript"],
    },
    {
      category: "Tools & Platforms",
      skills: ["Git/GitHub", "VS Code", "Figma", "Vite", "npm"],
    },
    {
      category: "Soft Skills",
      skills: [
        "Problem Solving",
        "Communication",
        "Team Work",
        "Time Management",
      ],
    },
  ];

  return (
    <section id="skills" className="bg-gray-900 py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center">Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skillCategories.map((category) => (
            <div key={category.category} className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-blue-400">
                {category.category}
              </h3>
              <ul className="space-y-2">
                {category.skills.map((skill) => (
                  <li key={skill} className="text-gray-300 flex items-center">
                    <span className="text-blue-400 mr-2">✓</span>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
