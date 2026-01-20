import React from "react";
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type SocialLink = {
  name: string;
  icon: LucideIcon;
  url: string;
  color: string;
};

const socials: SocialLink[] = [
  {
    name: "GitHub",
    icon: Github,
    url: "https://github.com/odionmurphy",
    color: "hover:text-gray-400",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    url: "https://linkedin.com/in/yourusername",
    color: "hover:text-blue-400",
  },
  {
    name: "Email",
    icon: Mail,
    url: "mailto:djmurphyluv@gmail.com?subject=Frontend%20Internship%20Inquiry",
    color: "hover:text-red-400",
  },
  {
    name: "Portfolio",
    icon: ExternalLink,
    url: "http://localhost:5173/#portfolio",
    color: "hover:text-yellow-400",
  },
];

const SocialLinks: React.FC = () => {
  return (
    <section id="social" className="py-20 bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-12">Connect With Me</h2>

        <div className="flex justify-center gap-8 flex-wrap mb-8">
          {socials.map(({ name, icon: Icon, url, color }) => {
            const isEmail = url.startsWith("mailto:");

            return (
              <a
                key={name}
                href={url}
                {...(!isEmail && {
                  target: "_blank",
                  rel: "noopener noreferrer",
                })}
                aria-label={name}
                title={name}
                className={`text-4xl transition transform hover:scale-110 ${color}`}
              >
                <Icon className="w-12 h-12" />
              </a>
            );
          })}
        </div>

        <p className="text-gray-300 text-lg">
          Let’s build something amazing together.
        </p>
      </div>
    </section>
  );
};

export default SocialLinks;
