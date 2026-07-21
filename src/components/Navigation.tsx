import React from "react";
import { motion } from "framer-motion";
import { Code } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearSession, getUser } from "../lib/auth";

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUser();

  const navLinks = [
    { name: "Home", to: "/", id: "home" },
    { name: "Shop", to: "/shop", id: "shop" },
    ...(user ? [] : [{ name: "Sign In", to: "/signin", id: "signin" }]),
  ];

  const handleSignOut = () => {
    clearSession();
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`sticky top-0 z-50 backdrop-blur-lg bg-gray-900`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <Code className="w-6 h-6 text-yellow-400" />
          <span className="text-2xl font-extrabold bg-gradient-to-r from-yellow-400 to-purple-500 bg-clip-text text-transparent">
            Digital Shop
          </span>
        </Link>

        <div className="flex gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;

            return (
              <Link
                key={link.id}
                to={link.to}
                className={`relative font-semibold transition-colors ${
                  isActive
                    ? "text-yellow-400"
                    : "text-gray-300 hover:text-yellow-400"
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.span
                    layoutId="activeLink"
                    className="absolute left-0 -bottom-2 h-0.5 w-full bg-yellow-400 rounded"
                  />
                )}
              </Link>
            );
          })}

          {user && (
            <div className="flex items-center gap-4">
              <span className="text-gray-300 text-sm">
                {user.name || user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="font-semibold text-gray-300 hover:text-yellow-400 transition-colors"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
