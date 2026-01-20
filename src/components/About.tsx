import React from "react";

const About: React.FC = () => {
  return (
    <section id="about" className="bg-gray-800 py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8 text-center">About Me</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              I'm a passionate junior frontend developer eager to build modern,
              responsive web applications. With a strong foundation in React,
              TypeScript,Docker, and Tailwind CSS , I create intuitive user experiences.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              I'm continuously learning and improving my skills through projects
              and real-world challenges. I'm excited to collaborate with teams
              and contribute to meaningful projects.
            </p>
          </div>
          <div className="bg-gray-900 p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Quick Facts</h3>
            <ul className="space-y-3 text-gray-300">
              <li>
                <span className="text-blue-400 font-bold">Experience:</span> 1-2
                years
              </li>
              <li>
                <span className="text-blue-400 font-bold">Location:</span> Menden saurland
              </li>
              <li>
                <span className="text-blue-400 font-bold">Availability:</span>{" "}
                Open to opportunities
              </li>
              <li>
                <span className="text-blue-400 font-bold">Education:</span>{" "}
                Bootcamp/ Dci-instintude Berlin
              
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
