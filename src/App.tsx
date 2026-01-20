import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Portfolio from "./components/Portfolio";
import ContactPage from "./pages/ContactPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import SocialLinks from "./components/SocialLinks";
import Footer from "./components/Footer";
import TorchLight from "./components/TorchLight";

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    // Handle hash-based scrolling
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navigation />
              <Hero />
              <About />
              <Skills />
              <Portfolio />
              <SocialLinks />
              <Footer />
              <TorchLight />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <Navigation />
              <ContactPage />
            </>
          }
        />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
