/// <reference types="vite/client" />
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  message: string;
  phone?: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email address";
    if (!formData.message.trim()) newErrors.message = "Message cannot be empty";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const apiUrl =
        (import.meta.env.VITE_API_URL as string) || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      console.log("Message sent:", data);
      setSuccess(true);
      setFormData({ name: "", email: "", message: "", phone: "" });
    } catch (err: any) {
      console.error("Error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSuccess(false), 6000);
    }
  };
  // ...existing code...

  return (
    <section id="contact" className="bg-gray-900 py-20">
      <div className="max-w-2xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-4 text-center"
        >
          Get In Touch
        </motion.h2>

        <p className="text-gray-400 text-center mb-10">
          Open to frontend roles, freelance work, and collaborations.
        </p>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit}
          className="bg-gray-800 p-8 rounded-xl border border-gray-700 space-y-6"
        >
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            className={`w-full px-4 py-3 rounded bg-gray-700 border ${
              errors.name ? "border-red-500" : "border-gray-600"
            } focus:ring-2 focus:ring-blue-500 outline-none`}
          />
          {errors.name && (
            <p className="text-red-400 text-sm mt-1">{errors.name}</p>
          )}

          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className={`w-full px-4 py-3 rounded bg-gray-700 border ${
              errors.email ? "border-red-500" : "border-gray-600"
            } focus:ring-2 focus:ring-blue-500 outline-none`}
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email}</p>
          )}

          <input
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Your phone number (optional)"
            className="w-full px-4 py-3 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <textarea
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell me about your project..."
            className={`w-full px-4 py-3 rounded bg-gray-700 border ${
              errors.message ? "border-red-500" : "border-gray-600"
            } focus:ring-2 focus:ring-blue-500 outline-none`}
          />
          {errors.message && (
            <p className="text-red-400 text-sm mt-1">{errors.message}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 py-3 rounded-lg font-semibold transition"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>

          {success && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-green-400 text-center text-sm mt-2"
            >
              Message sent successfully.
            </motion.p>
          )}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-center text-sm mt-2"
            >
              {error}
            </motion.p>
          )}
        </motion.form>

        <div className="flex justify-center gap-6 mt-8 text-gray-400">
          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-gray-200 transition"
          >
            <Github size={18} /> GitHub
          </a>
          <a
            href="https://linkedin.com/in/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-blue-400 transition"
          >
            <Linkedin size={18} /> LinkedIn
          </a>
          <a
            href="mailto:djmurphyluv@gmail.com"
            className="flex items-center gap-1 hover:text-red-400 transition"
          >
            <Mail size={18} /> Email
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
