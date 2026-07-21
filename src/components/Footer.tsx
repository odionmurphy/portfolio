import React from "react";
import { Link } from "react-router-dom";
import { Code, Github, Linkedin, Mail } from "lucide-react";
import { products } from "../data/products";

const categories = Array.from(
  new Set(products.map((p) => p.category).filter(Boolean)),
) as string[];

const socials = [
  {
    name: "GitHub",
    icon: Github,
    url: "https://github.com/odionmurphy",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    url: "https://linkedin.com/in/yourusername",
  },
  {
    name: "Email",
    icon: Mail,
    url: "mailto:djmurphyluv@gmail.com",
  },
];

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 border-t border-gray-800">
      <div className="container mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-3">
            <Code className="w-5 h-5 text-yellow-400" />
            <span className="text-xl font-extrabold bg-gradient-to-r from-yellow-400 to-purple-500 bg-clip-text text-transparent">
              Digital Shop
            </span>
          </Link>
          <p className="text-sm text-gray-400">
            Templates, guides, and scripts to help you build and ship faster.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Shop</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <Link to="/shop" className="hover:text-yellow-400 transition-colors">
                All Products
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c}>
                <Link
                  to={`/shop?category=${encodeURIComponent(c)}`}
                  className="hover:text-yellow-400 transition-colors"
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Account</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <Link to="/signin" className="hover:text-yellow-400 transition-colors">
                Sign In
              </Link>
            </li>
            <li>
              <Link to="/signup" className="hover:text-yellow-400 transition-colors">
                Create Account
              </Link>
            </li>
            <li>
              <Link to="/checkout" className="hover:text-yellow-400 transition-colors">
                Checkout
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Connect</h4>
          <div className="flex gap-4">
            {socials.map(({ name, icon: Icon, url }) => (
              <a
                key={name}
                href={url}
                {...(!url.startsWith("mailto:") && {
                  target: "_blank",
                  rel: "noopener noreferrer",
                })}
                aria-label={name}
                title={name}
                className="text-gray-400 hover:text-yellow-400 transition-colors"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-6">
        <p className="text-center text-sm text-gray-500">
          &copy; {year} Digital Shop. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
