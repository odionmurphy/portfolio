import React, { useRef, useEffect } from "react";
import {
  Code,
  Type,
  Layout,
  Zap,
  GitBranch,
  Monitor,
  Figma,
  Package,
  Activity,
  MessageSquare,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";

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

  const iconMap: Record<string, React.ElementType> = {
    React: Zap,
    TypeScript: Type,
    "Tailwind CSS": Layout,
    "HTML/CSS": Code,
    JavaScript: Zap,

    "Git/GitHub": GitBranch,
    "VS Code": Monitor,
    Figma: Figma,
    Vite: Zap,
    npm: Package,

    "Problem Solving": Activity,
    Communication: MessageSquare,
    "Team Work": Users,
    "Time Management": Clock,
  };

  // Flatten skills for the auto-scrolling row
  const allSkills = skillCategories.flatMap((c) => c.skills);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const isPaused = useRef(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    // Duplicate contents to allow seamless looping
    const speed = 0.5; // px per tick
    let rafId: number;

    const step = () => {
      if (!el || isPaused.current) {
        rafId = requestAnimationFrame(step);
        return;
      }
      el.scrollLeft += speed;
      // loop when one full set has scrolled
      if (el.scrollLeft >= el.scrollWidth / 2) {
        el.scrollLeft = 0;
      }
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section id="skills" className="bg-gray-900 py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center">Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skillCategories.map((category) => (
            <div key={category.category} className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-yellow-400">
                {category.category}
              </h3>
              <ul className="space-y-2">
                {category.skills.map((skill) => {
                  const Icon = iconMap[skill] || CheckCircle;
                  return (
                    <li key={skill} className="text-gray-300 flex items-center">
                      <Icon className="w-5 h-5 text-yellow-400 mr-3" />
                      <span>{skill}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Auto-scrolling skill bar */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-4 text-yellow-400">
            All Skills
          </h3>
          <div
            ref={scrollerRef}
            onMouseEnter={() => (isPaused.current = true)}
            onMouseLeave={() => (isPaused.current = false)}
            className="relative overflow-hidden overflow-x-auto"
            style={{ height: 72 }}
          >
            <div
              className="flex gap-6 items-center will-change-transform"
              style={{ whiteSpace: "nowrap", padding: "10px 12px" }}
            >
              {[...allSkills, ...allSkills].map((skill, i) => {
                const Icon = iconMap[skill] || CheckCircle;
                return (
                  <div
                    key={`${skill}-${i}`}
                    className="inline-flex items-center bg-gray-800 px-4 py-2 rounded-lg text-gray-200 mr-4"
                    style={{ minWidth: 160 }}
                  >
                    <Icon className="w-6 h-6 text-yellow-400 mr-3" />
                    <span className="font-medium">{skill}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
