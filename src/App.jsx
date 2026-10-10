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
      <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
        <div className="absolute inset-0">
          <Scene />
        </div>
      </div>

      {/* Dark Overlay */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[#06151D]/75" />

      {/* Page Content */}
      <main className="relative z-10 flex w-full min-w-0 flex-col items-stretch overflow-x-clip">
        <section className="w-full min-w-0">
          <Hero />
        </section>

        <section className="w-full min-w-0">
          <About />
        </section>

        <section className="w-full min-w-0">
          <Skills />
        </section>

        <section className="w-full min-w-0">
          <Projects />
        </section>

        <section className="w-full min-w-0">
          <Experience />
        </section>

        <section className="w-full min-w-0">
          <Education />
        </section>

        <section className="w-full min-w-0">
          <Contact />
        </section>
      </main>
    </MainLayout>
  );
}
