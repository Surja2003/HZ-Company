import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import logoImage from "@/assets/d02f6d670ee484ccb5b3f98463b90941b5d1ead6.png";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let last = window.scrollY > 8;
    setIsScrolled(last);
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const next = window.scrollY > 8;
        if (next !== last) {
          last = next;
          setIsScrolled(next);
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true } as AddEventListenerOptions);
    return () => window.removeEventListener("scroll", onScroll as any);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    window.requestAnimationFrame(() => setIsScrolled(window.scrollY > 8));
  }, [location.pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="fixed top-4 inset-x-0 z-50 px-4">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-blue-700 focus:shadow"
      >
        Skip to content
      </a>

      <div className="mx-auto max-w-7xl">
        <div
          className={
            "rounded-2xl border backdrop-blur-lg transition-all duration-300 ease-out " +
            (isScrolled
              ? "bg-white/85 border-white/30 shadow-lg"
              : "bg-white/55 border-white/20 shadow-md")
          }
        >
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Logo */}
              <Link to="/" className="flex items-center group">
                <img
                  src={logoImage}
                  alt="HZ IT Logo"
                  className="h-10 w-10 object-contain"
                />
                <span
                  className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  HZ IT Company
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative text-sm font-medium transition-colors duration-300 ${
                      location.pathname === link.path
                        ? "text-blue-700"
                        : "text-gray-800 hover:text-blue-700"
                    }`}
                  >
                    {link.name}
                    {location.pathname === link.path && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-700"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                ))}
                <Link
                  to="/hire-us"
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-sm hover:shadow-lg hover:scale-[1.03] transition-all duration-200"
                >
                  Hire Us
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
                className="md:hidden p-2 rounded-lg transition-colors hover:bg-white/60 text-gray-900"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -6, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden mt-3 rounded-2xl bg-white/85 backdrop-blur-lg border border-white/25 shadow-lg overflow-hidden"
            >
              <div className="px-6 py-6 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block py-2 text-sm font-medium transition-colors ${
                      location.pathname === link.path
                        ? "text-blue-700"
                        : "text-gray-800"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  to="/hire-us"
                  className="block px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-center shadow-sm"
                >
                  Hire Us
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}