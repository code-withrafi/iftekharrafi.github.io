import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiCode, FiServer, FiDatabase, FiTool, FiCpu, FiStar } from 'react-icons/fi';

import SectionTitle from '@/components/common/SectionTitle';
import { skills } from '@/constants/skills';

const categoryIcons = {
  Frontend: FiCode,
  Backend: FiServer,
  Database: FiDatabase,
  'AI/ML': FiCpu,
  'Frameworks & Libraries': FiCode,
  'Generative AI': FiStar,
  Tools: FiTool,
};

function SkillTag({ name }) {
  return (
    <span className="inline-flex max-w-full items-center rounded-xl border border-white/15 bg-[#173746] px-3 py-2 text-sm leading-5 font-medium text-white transition-colors duration-200 hover:border-[#45A9A9]/60 hover:bg-[#1b4654]">
      <span className="break-words">{name}</span>
    </span>
  );
}

function SkillCategoryCard({ category, items, index }) {
  const Icon = categoryIcons[category] || FiCode;

  return (
    <motion.article
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.16) }}
      className="h-full min-w-0"
    >
      <div className="h-full min-w-0 rounded-3xl border border-white/10 bg-[#102936] p-5 transition-colors duration-300 hover:border-[#45A9A9]/35 sm:p-6 lg:p-7">
        <div className="mb-6 flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#45A9A9]/25 bg-[#45A9A9]/10">
            <Icon className="h-5 w-5 text-[#72d8d0]" />
          </div>

          <div className="min-w-0">
            <h3 className="text-lg font-bold break-words text-white">{category}</h3>

            <p className="mt-1 text-sm text-slate-300">
              {items.length} {items.length === 1 ? 'skill' : 'skills'}
            </p>
          </div>
        </div>

        <div className="flex min-w-0 flex-wrap items-start gap-2">
          {items.map((skill, skillIndex) => (
            <SkillTag
              key={`${category}-${skill}-${skillIndex}`}
              name={typeof skill === 'string' ? skill : skill.name}
            />
          ))}
        </div>
      </div>
    </motion.article>
  );
}

function CategoryTabs({ categories, activeCategory, onCategoryChange }) {
  return (
    <div className="mb-10 flex flex-wrap justify-center gap-2">
      {['All', ...categories].map((category) => {
        const isActive = activeCategory === category;

        return (
          <button
            key={category}
            type="button"
            aria-pressed={isActive}
            onClick={() => onCategoryChange(category)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#72d8d0] ${
              isActive
                ? 'border-[#45A9A9] bg-[#45A9A9] text-[#071d27]'
                : 'border-white/15 bg-[#102936] text-slate-200 hover:border-[#45A9A9]/50 hover:bg-[#173746] hover:text-white'
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(() => Object.keys(skills), []);

  const filteredSkills = useMemo(() => {
    const entries = Object.entries(skills);

    return activeCategory === 'All'
      ? entries
      : entries.filter(([category]) => category === activeCategory);
  }, [activeCategory]);

  const totalSkills = useMemo(
    () => Object.values(skills).reduce((total, items) => total + items.length, 0),
    [],
  );

  const bottomStats = [
    { label: 'Categories', value: categories.length },
    { label: 'Technologies', value: totalSkills },
    { label: 'Projects Built', value: '10+' },
    { label: 'Years Coding', value: '2+' },
  ];

  return (
    <section id="skills" className="relative isolate overflow-hidden py-16 sm:py-20">
      {/* Subtle background decoration */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-[10%] h-64 w-64 rounded-full bg-[#45A9A9]/[0.04] blur-3xl" />
        <div className="absolute right-[10%] bottom-10 h-72 w-72 rounded-full bg-[#98E8DE]/[0.03] blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-12">
        <SectionTitle
          subtitle="Skills"
          title="Technologies I Work With"
          description="A comprehensive toolkit of technologies and frameworks I use to build amazing digital experiences"
          align="center"
          variant="brackets"
        />

        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <div className="grid min-w-0 grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredSkills.map(([category, items], index) => (
            <SkillCategoryCard key={category} category={category} items={items} index={index} />
          ))}
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:mt-16 sm:grid-cols-4">
          {bottomStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-[#102936] p-4 text-center transition-colors duration-200 hover:border-[#45A9A9]/35 sm:p-5"
            >
              <div className="bg-gradient-to-r from-[#72d8d0] to-[#98E8DE] bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                {stat.value}
              </div>

              <div className="mt-1 text-sm text-slate-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
