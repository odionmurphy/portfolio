import React from "react";
import { motion } from "framer-motion";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import SocialLinks from "../components/SocialLinks";

const ContactPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Contact />
      <SocialLinks />
      <Footer />
    </motion.div>
  );
};

export default ContactPage;
