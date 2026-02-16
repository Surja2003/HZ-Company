import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "VP Engineering",
    role: "B2B SaaS",
    content:
      "HZ IT Company tightened our delivery process and helped us ship a stable release train. Their architecture guidance and clean handover documentation made our internal team faster immediately.",
    rating: 5,
  },
  {
    id: 2,
    name: "Head of Product",
    role: "Healthcare startup",
    content:
      "They delivered a mobile MVP with great UX and no surprises. Weekly demos, clear scope control, and an emphasis on performance made the rollout smooth.",
    rating: 5,
  },
  {
    id: 3,
    name: "Operations Lead",
    role: "Logistics platform",
    content:
      "We needed reliability and fast iteration. HZ IT Company shipped improvements in small, testable increments and kept stakeholders aligned with simple, consistent reporting.",
    rating: 5,
  },
];

export function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20"
        >
          {/* Quote Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mb-6 shadow-lg">
            <Quote className="text-white" size={32} />
          </div>

          {/* Content */}
          <p className="text-gray-700 text-lg md:text-xl mb-8 leading-relaxed italic">
            "{testimonials[currentIndex].content}"
          </p>

          {/* Rating */}
          <div className="flex mb-4">
            {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
              <svg
                key={i}
                className="w-5 h-5 text-yellow-400 fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>

          {/* Author */}
          <div>
            <p className="font-bold text-gray-900 text-lg font-poppins">
              {testimonials[currentIndex].name}
            </p>
            <p className="text-blue-600 text-sm">{testimonials[currentIndex].role}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-center items-center mt-8 space-x-4">
        <button
          onClick={prev}
          aria-label="Previous testimonial"
          className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-lg shadow-lg hover:shadow-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-200 border border-white/40"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Dots */}
        <div className="flex space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to testimonial ${index + 1}`}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex ? "bg-blue-600 w-8" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          aria-label="Next testimonial"
          className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-lg shadow-lg hover:shadow-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-200 border border-white/40"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}