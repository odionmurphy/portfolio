/// <reference types="vite/client" />
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

// Contact form with backend integration
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
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);

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

  const [cvFile, setCvFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) setCvFile(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const envApi = (import.meta.env.VITE_API_URL as string) || "";
      let apiUrl = envApi ?? ""; // use relative path when not provided

      // If running on the deployed frontend and no VITE_API_URL set, point to known backend
      try {
        const host =
          typeof window !== "undefined" ? window.location.hostname : "";
        if (!apiUrl && host.includes("portfolio-frontend-pgj0.onrender.com")) {
          apiUrl = "https://portfolio-backend-uy9a.onrender.com";
        }
      } catch (e) {
        // ignore
      }

      console.log("API URL:", apiUrl);

      let response: Response;

      if (cvFile) {
        const form = new FormData();
        form.append("name", formData.name);
        form.append("email", formData.email);
        form.append("phone", formData.phone || "");
        form.append("message", formData.message);
        form.append("cv", cvFile, cvFile.name);

        response = await fetch(`${apiUrl}/api/contact`, {
          method: "POST",
          body: form,
        });
      } else {
        response = await fetch(`${apiUrl}/api/contact`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Server error: ${response.status}`,
        );
      }

      const data = await response.json();
      console.log("Message sent:", data);
      setSuccess(true);
      setFormData({ name: "", email: "", message: "", phone: "" });
      setCvFile(null);
      if (data.fileUrl) setUploadedFileUrl(data.fileUrl);
      setUploadedFileUrl(data.fileUrl || null);
    } catch (err: any) {
      console.error("Error:", err);
      setError(
        err.message ||
          "Failed to send message. Please check your connection or try again later.",
      );
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSuccess(false), 6000);
    }
  };
  // ...existing code...

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-gray-900 py-20"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <radialGradient id="g1" cx="30%" cy="25%" r="40%">
              <stop offset="0%" stopColor="#FACC15" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FACC15" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="g2" cx="80%" cy="85%" r="40%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </radialGradient>
            <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="12" />
            </filter>
          </defs>

          <circle
            cx="20"
            cy="20"
            r="30"
            fill="url(#g1)"
            filter="url(#blur)"
            opacity="0.18"
          />
          <circle
            cx="85"
            cy="85"
            r="30"
            fill="url(#g2)"
            filter="url(#blur)"
            opacity="0.18"
          />
        </svg>
      </div>
      <div className="relative z-10 max-w-2xl mx-auto px-4">
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
            } focus:ring-2 focus:ring-yellow-500 outline-none`}
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
            } focus:ring-2 focus:ring-yellow-500 outline-none`}
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
            className="w-full px-4 py-3 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-yellow-500 outline-none"
          />

          <textarea
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell me about your project..."
            className={`w-full px-4 py-3 rounded bg-gray-700 border ${
              errors.message ? "border-red-500" : "border-gray-600"
            } focus:ring-2 focus:ring-yellow-500 outline-none`}
          />
          {errors.message && (
            <p className="text-red-400 text-sm mt-1">{errors.message}</p>
          )}

          {/* CV Upload */}
          <div className="mt-2">
            <label className="block text-sm text-gray-300 mb-2">
              Attach CV (optional)
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-200"
            />
            {cvFile && (
              <p className="text-sm text-gray-300 mt-2">
                Selected: {cvFile.name}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-400 py-3 rounded-lg font-semibold transition mt-4"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>

          {success && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-sm mt-2"
            >
              <p className="text-green-400">Message sent successfully.</p>
              {uploadedFileUrl && (
                <p className="mt-1">
                  <a
                    href={uploadedFileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-yellow-400 underline"
                  >
                    View uploaded CV
                  </a>
                </p>
              )}
            </motion.div>
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
            href="https://github.com/odionmurphy"
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
            className="flex items-center gap-1 hover:text-yellow-400 transition"
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
