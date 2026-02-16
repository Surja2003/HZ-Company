import { useState } from "react";
import { motion } from "motion/react";
import { ExternalLink, Github } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Seo } from "../components/Seo";

export function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Web Development", "Mobile Apps", "Cloud Solutions", "UI/UX Design"];

  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      category: "Web Development",
      description: "Modern e-commerce platform with real-time inventory and payment integration",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      image: "ecommerce shopping",
    },
    {
      id: 2,
      title: "Healthcare Mobile App",
      category: "Mobile Apps",
      description: "HIPAA-compliant telemedicine app connecting patients with doctors",
      technologies: ["React Native", "Firebase", "WebRTC"],
      image: "healthcare mobile",
    },
    {
      id: 3,
      title: "Financial Dashboard",
      category: "Cloud Solutions",
      description: "Real-time financial analytics dashboard with AI-powered insights",
      technologies: ["Next.js", "AWS", "Python", "TensorFlow"],
      image: "financial dashboard",
    },
    {
      id: 4,
      title: "Social Media Platform",
      category: "Web Development",
      description: "Feature-rich social networking platform with real-time messaging",
      technologies: ["React", "GraphQL", "PostgreSQL", "Redis"],
      image: "social media",
    },
    {
      id: 5,
      title: "Fitness Tracking App",
      category: "Mobile Apps",
      description: "Comprehensive fitness and nutrition tracking mobile application",
      technologies: ["Flutter", "Firebase", "ML Kit"],
      image: "fitness workout",
    },
    {
      id: 6,
      title: "Enterprise CRM System",
      category: "Cloud Solutions",
      description: "Scalable CRM solution for managing customer relationships and sales",
      technologies: ["Vue.js", "Azure", "SQL Server"],
      image: "business crm",
    },
    {
      id: 7,
      title: "Restaurant Booking App",
      category: "UI/UX Design",
      description: "Elegant restaurant discovery and booking platform",
      technologies: ["Figma", "React", "Tailwind CSS"],
      image: "restaurant dining",
    },
    {
      id: 8,
      title: "Real Estate Portal",
      category: "Web Development",
      description: "Comprehensive property listing and virtual tour platform",
      technologies: ["Next.js", "Three.js", "Mapbox"],
      image: "real estate",
    },
    {
      id: 9,
      title: "Education LMS",
      category: "Cloud Solutions",
      description: "Learning management system with video conferencing and assessments",
      technologies: ["React", "AWS", "Zoom API"],
      image: "education learning",
    },
  ];

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen">
      <Seo
        title="Case Studies"
        description="Explore recent projects shipped by HZ IT Company—web apps, mobile products, cloud platforms, and design systems built for real business outcomes."
        path="/portfolio"
      />
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-blue-900 via-blue-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1
              className="text-5xl md:text-6xl font-bold mb-6"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Our Portfolio
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Showcasing our expertise through successful projects delivered to clients worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                    : "bg-white/70 backdrop-blur-sm text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group bg-white/70 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/40"
              >
                {/* Project Image */}
                <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800">
                  <ImageWithFallback
                    src={`https://source.unsplash.com/800x600/?${project.image}`}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      type="button"
                      aria-label={`Open live preview for ${project.title}`}
                      className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-200 transform hover:scale-110 border border-white/40"
                    >
                      <ExternalLink size={20} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Open source repository for ${project.title}`}
                      className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-200 transform hover:scale-110 border border-white/40"
                    >
                      <Github size={20} />
                    </button>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <div className="text-sm text-blue-600 font-medium mb-2">
                    {project.category}
                  </div>
                  <h3
                    className="text-xl font-bold mb-2 text-gray-900"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No projects found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "500+", label: "Projects Delivered" },
              { value: "150+", label: "Happy Clients" },
              { value: "98%", label: "Success Rate" },
              { value: "50+", label: "Industry Awards" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div
                  className="text-5xl font-bold mb-2"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {stat.value}
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-4xl md:text-5xl font-bold mb-6 text-gray-900"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Have a Project in Mind?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Let's collaborate to bring your vision to life with our proven expertise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
                Start Your Project
              </button>
              <button className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200">
                View Case Studies
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}