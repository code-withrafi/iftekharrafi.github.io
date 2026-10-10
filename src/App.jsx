import MainLayout from '@/layouts/MainLayout';
import useSmoothScroll from '@/hooks/useSmoothScroll';

import { Scene } from '@/components/three';

import Hero from '@/sections/Hero';
import About from '@/sections/About';
import Skills from '@/sections/Skills';
import Projects from '@/sections/Projects';
import Experience from '@/sections/Experience';
import Education from '@/sections/Education';
import Contact from '@/sections/Contact';

export default function App() {
  useSmoothScroll();

  return (
    <MainLayout>
      {/* 3D Background */}
      <div className="fixed inset-0 -z-20 h-screen w-screen">
        <Scene />
      </div>

      {/* Dark Overlay */}
      <div className="fixed inset-0 -z-10 h-screen w-screen bg-[#06151D]/75" />

      {/* Page Content */}
      <div className="relative z-10 flex w-full flex-col items-center">
        {/* Hero Section - independently aligned */}
        <div className="w-full -translate-x-3 sm:-translate-x-4 lg:-translate-x-6">
          <Hero />
        </div>

        {/* About Section - original alignment */}
        <About />

        {/* Skills Section - original alignment */}
        <Skills />

        {/* Projects Section - original alignment */}
        <Projects />

        {/* Experience Section - original alignment */}
        <Experience />

        {/* Education Section - original alignment */}
        <Education />

        {/* Contact Section - independently aligned */}
        <div className="w-full">
          <Contact />
        </div>
      </div>
    </MainLayout>
  );
}
