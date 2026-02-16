import { Outlet } from "react-router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";
import { FloatingWhatsApp } from "./FloatingWhatsApp";

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col font-inter overflow-x-hidden">
      <header>
        <Navbar />
      </header>
      <main className="flex-1" id="main-content">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
      <FloatingWhatsApp />
    </div>
  );
}