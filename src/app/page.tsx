import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import Timeline from '@/components/sections/Timeline';
import Projects from '@/components/sections/Projects';
import OpenSource from '@/components/sections/OpenSource';
import Certifications from '@/components/sections/Certifications';
import Research from '@/components/sections/Research';
import Notebook from '@/components/sections/Notebook';
import Contact from '@/components/sections/Contact';

export default function Home() {
  return (
    <div className="hub-grid-bg relative min-h-screen text-hub-text overflow-x-hidden flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-16">
        <section id="hero" className="min-h-[calc(100vh-4rem)] flex items-center">
          <Hero />
        </section>

        <section id="about" className="section-padding">
          <About />
        </section>

        <section id="skills" className="section-padding">
          <Skills />
        </section>

        <section id="timeline" className="section-padding">
          <Timeline />
        </section>

        <section id="projects" className="section-padding">
          <Projects />
        </section>

        <section id="opensource" className="section-padding">
          <OpenSource />
        </section>

        <section id="certifications" className="section-padding">
          <Certifications />
        </section>

        <section id="research" className="section-padding">
          <Research />
        </section>

        <section id="notebook" className="section-padding">
          <Notebook />
        </section>

        <section id="contact" className="section-padding">
          <Contact />
        </section>
      </main>

      <Footer />
    </div>
  );
}
