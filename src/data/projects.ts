import { Project } from "../components/ProjectCard";

export const projects: Project[] = [
{
  id: 1,
  slug: "delivery-truck-platform",
  title: "Truck Delivery Platform",
  description:
    "A responsive truck delivery website showcasing logistics services across multiple German cities, featuring multilingual support, clean UI, and optimized performance for modern browsers.",
  
  technologies: ["TypeScript", "HTML", "CSS", "i18n"],
  link: "#",
  github: "https://github.com/odionmurphy/project-Delivery-truck/tree/main",
  image: "driver.png",
  role: "Frontend Developer",
  year: "2025",
  status: "Completed",

  highlights: [
    "Implemented internationalization (i18n) to support multiple languages",
    "Designed a responsive layout optimized for desktop and mobile devices",
    "Structured scalable TypeScript code for maintainability",
    "Improved accessibility and performance through clean semantic markup"
  ],
},
  

  {
    id: 2,
    slug: "task-manager-app",
    title: "Task Manager App",
    description:
      "A productivity-focused task management app with Docker functionality and local persistence.",
    image: "https://via.placeholder.com/600x400?text=Task+Manager",
    technologies: ["React", "JavaScript", "CSS"],
    link: "#",
     github: "https://github.com/odionmurphy", // ✅ add this

    role: "Frontend Developer",
    year: "2023",
    status: "Completed",

    highlights: [
      "Designed intuitive task flows",
      "Persisted state using localStorage",
      "Reduced component complexity through refactoring",
    ],
  },

  {
    id: 3,
    slug: "weather-application",
    title: "Weather Application",
    description:
      "A real-time weather application that fetches data from a public API and displays current conditions and forecasts.",
   
    technologies: ["React", "API", "Tailwind CSS"],
    link: "#",
    github: "https://github.com/odionmurphy", // ✅ add this
    image: "weather.png",


    role: "Frontend Developer",
    year: "2023",
    status: "Completed",

    highlights: [
      "Integrated third-party weather API",
      "Handled loading, error, and empty states",
      "Built responsive UI for mobile and desktop",
    ],
  },

  {
    id: 4,
    slug: "portfolio-website",
    title: "Portfolio Website",
    description:
      "A personal portfolio showcasing projects, skills, and experience with a focus on performance and accessibility.",
      image: "animal.png",

    
    technologies: ["React", "TypeScript", "Tailwind CSS"],
    link: "#",
    github: "https://github.com/odionmurphy", // ✅ add this

    role: "Frontend Developer",
    year: "2024",
    status: "Completed",
    


    highlights: [
      "Built reusable UI components",
      "Implemented animated interactions and modal case studies",
      "Improved accessibility and semantic HTML structure",
    ],
  },
];
