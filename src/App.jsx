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
      <div className="relative min-h-screen">
        {/* 3D Background */}

        <div className="fixed inset-0 -z-20">
          <Scene />
        </div>

        {/* Dark Overlay */}

        <div className="fixed inset-0 -z-10 bg-[#06151D]/75" />

        {/* Content */}

        <div className="relative z-10">
          <Hero />

          <About />

          <Skills />

          <Projects />

          <Experience />

          <Education />

          <Contact />
        </div>
      </div>
    </MainLayout>
  );
}
