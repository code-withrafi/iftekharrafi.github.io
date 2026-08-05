import { useState, useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiCode, FiServer, FiDatabase, FiTool, FiCpu, FiGlobe, FiStar } from 'react-icons/fi';
import SectionTitle from '@/components/common/SectionTitle';
import { skills } from '@/constants/skills';

// Category icons mapping - moved outside component
const categoryIcons = {
  Frontend: FiCode,
  Backend: FiServer,
  Database: FiDatabase,
  'AI/ML': FiCpu,
  Tools: FiTool,
  Languages: FiGlobe,
  Frameworks: FiCode,
  DevOps: FiServer,
  Design: FiTool,
  Other: FiStar,
};

// REDUCED particles - only 5 instead of 20
function generateParticles(count = 5) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${(i * 20) % 100}%`,
    duration: 15 + ((i * 5) % 10),
    delay: (i * 2) % 8,
  }));
}

// Individual skill tag - OPTIMIZED
const SkillTag = ({ name, icon: Icon, index = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      className="group flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] px-3.5 py-2.5 transition-all duration-200 hover:border-[#45A9A9]/30 hover:bg-[#45A9A9]/5"
    >
      {Icon && (
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#45A9A9]/20 to-[#98E8DE]/20">
          <Icon className="h-3.5 w-3.5 text-[#45A9A9]" />
        </div>
      )}
      <span className="text-sm font-medium text-white/70">{name}</span>
    </motion.div>
  );
};

// Skill category card - OPTIMIZED
function SkillCategoryCard({ category, items, index = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const Icon = categoryIcons[category] || FiCode;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.4, ease: 'easeOut' }}
      className="group relative"
    >
      {/* Card */}
      <div className="relative h-full rounded-3xl border border-white/5 bg-white/[0.02] p-6 transition-all duration-300 group-hover:border-[#45A9A9]/20 sm:p-8">
        {/* Header */}
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#45A9A9]/20 to-[#98E8DE]/20">
            <Icon className="h-5 w-5 text-[#45A9A9]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{category}</h3>
            <p className="text-sm text-white/40">
              {items.length} {items.length === 1 ? 'skill' : 'skills'}
            </p>
          </div>
        </div>

        {/* Skills tags grid */}
        <div className="flex flex-wrap gap-2">
          {items.map((skill, skillIndex) => (
            <SkillTag key={skill.name} name={skill.name} icon={skill.icon} index={skillIndex} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Floating particles background - GREATLY REDUCED
function FloatingParticles() {
  const particles = useMemo(() => generateParticles(5), []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ opacity: 0, y: '100vh' }}
          animate={{
            opacity: [0, 0.3, 0],
            y: ['100vh', '-10vh'],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'linear',
          }}
          className="absolute h-1 w-1 rounded-full bg-[#45A9A9]/10"
          style={{ left: particle.left }}
        />
      ))}
    </div>
  );
}

// Category tabs - OPTIMIZED (no motion buttons)
function CategoryTabs({ categories, activeCategory, onCategoryChange }) {
  return (
    <div className="mb-10 flex flex-wrap justify-center gap-2">
      {['All', ...categories].map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
            activeCategory === category
              ? 'bg-[#45A9A9] text-white shadow-lg shadow-[#45A9A9]/25'
              : 'border border-white/5 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

// Memoized bottom stats data
const bottomStats = [
  { label: 'Categories', value: Object.keys(skills).length },
  { label: 'Technologies', value: Object.values(skills).flat().length },
  { label: 'Projects Built', value: '10+' },
  { label: 'Years Coding', value: '2+' },
];

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState('All');

  // Memoize categories
  const categories = useMemo(() => Object.keys(skills), []);

  // Memoize filtered skills
  const filteredSkills = useMemo(() => {
    return activeCategory === 'All'
      ? Object.entries(skills)
      : Object.entries(skills).filter(([category]) => category === activeCategory);
  }, [activeCategory]);

  return (
    <section id="skills" className="relative overflow-hidden py-20 sm:py-28">
      {/* Floating particles - now only 5 */}
      <FloatingParticles />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Section Title */}
        <SectionTitle
          subtitle="Skills"
          title="Technologies I Work With"
          description="A comprehensive toolkit of technologies and frameworks I use to build amazing digital experiences"
          align="center"
          variant="brackets"
        />

        {/* Category Tabs */}
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Skills Grid - removed AnimatePresence and layout animation */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3">
          {filteredSkills.map(([category, items], index) => (
            <SkillCategoryCard key={category} category={category} items={items} index={index} />
          ))}
        </div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {bottomStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center transition-all duration-200 hover:border-[#45A9A9]/20"
            >
              <div className="bg-gradient-to-r from-[#45A9A9] to-[#98E8DE] bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-white/40">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
