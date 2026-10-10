import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiCode, FiDatabase, FiCpu, FiGlobe, FiArrowRight } from 'react-icons/fi';
import SectionTitle from '@/components/common/SectionTitle';
import profilePicture from '@/assets/images/profilepicture/rafi.jpg';

// Animated text reveal - OPTIMIZED (fewer words animated)
function AnimatedText({ text, delay = 0 }) {
  const words = useMemo(() => text.split(' '), [text]);

  return (
    <span>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{
            delay: delay + i * 0.03,
            duration: 0.3,
            ease: 'easeOut',
          }}
          className="mr-[0.25em] inline-block"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

// Stat card - OPTIMIZED with requestAnimationFrame
function StatCard({ value, label, icon: Icon, delay = 0 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = parseInt(value);
    const duration = 1.5; // Reduced from 2
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = (currentTime - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * end);

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      className="group relative rounded-2xl border border-white/5 bg-white/5 p-6 transition-all duration-200 hover:border-[#45A9A9]/20"
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#45A9A9]/20 to-[#98E8DE]/20">
          <Icon className="h-5 w-5 text-[#45A9A9]" />
        </div>
        <FiArrowRight className="h-4 w-4 text-white/20 transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#45A9A9]" />
      </div>
      <div className="text-3xl font-bold text-white">{count}+</div>
      <div className="mt-1 text-sm text-white/50">{label}</div>
    </motion.div>
  );
}

// Floating decorative elements - STATIC (no animations)
function DecorativeElements() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Static circles */}
      <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full border border-[#45A9A9]/5" />
      <div className="absolute -top-10 -right-10 h-60 w-60 rounded-full border border-[#98E8DE]/5" />

      {/* Dots grid */}
      <div
        className="absolute top-1/2 left-0 h-40 w-full opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, #45A9A9 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />
    </div>
  );
}

// Image/avatar component - OPTIMIZED
function Avatar() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative"
    >
      {/* Glow effects - removed animate-pulse */}
      <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#45A9A9]/10 to-[#98E8DE]/10 blur-3xl" />

      {/* Main avatar container */}
      <div className="relative h-64 w-64 overflow-hidden rounded-3xl border-2 border-[#45A9A9]/20 bg-gradient-to-br from-[#45A9A9]/10 to-[#98E8DE]/10 sm:h-80 sm:w-80">
        {/* Profile image */}
        <img
          src={profilePicture}
          alt="Iftekhar Rafi"
          className="h-full w-full object-cover"
          loading="lazy"
        />

        {/* Decorative corners */}
        <div className="absolute top-0 left-0 h-16 w-16 rounded-tl-2xl border-t-2 border-l-2 border-[#45A9A9]/40" />
        <div className="absolute top-0 right-0 h-16 w-16 rounded-tr-2xl border-t-2 border-r-2 border-[#45A9A9]/40" />
        <div className="absolute bottom-0 left-0 h-16 w-16 rounded-bl-2xl border-b-2 border-l-2 border-[#45A9A9]/40" />
        <div className="absolute right-0 bottom-0 h-16 w-16 rounded-br-2xl border-r-2 border-b-2 border-[#45A9A9]/40" />
      </div>
    </motion.div>
  );
}

// Memoized stats data
const statsData = [
  { value: '10', label: 'Projects Completed', icon: FiCode },
  { value: '5', label: 'Technologies', icon: FiCpu },
  { value: '2', label: 'Years Experience', icon: FiGlobe },
  { value: '3', label: 'Certifications', icon: FiDatabase },
];

export default function About() {
  const sectionRef = useRef(null);

  return (
    <section ref={sectionRef} id="about" className="relative overflow-hidden py-16 sm:py-20">
      {/* Decorative elements */}
      <DecorativeElements />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Section Title */}
        <SectionTitle
          subtitle="About Me"
          title="Turning Ideas into Reality"
          description="Passionate about creating innovative solutions through code"
        />

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left - Avatar */}
          <div className="flex justify-center lg:justify-start">
            <Avatar />
          </div>

          {/* Right - Content */}
          <div className="space-y-6">
            {/* Main description */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="flex items-center gap-3"
              >
                <span className="h-px w-8 bg-[#45A9A9]" />
                <span className="text-sm font-medium tracking-widest text-[#45A9A9] uppercase">
                  Who I Am
                </span>
              </motion.div>

              <h3 className="text-2xl font-bold text-white sm:text-3xl">
                <AnimatedText text="Software Engineering Student & AI Enthusiast" delay={0.3} />
              </h3>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="leading-relaxed text-white/60"
              >
                I'm a passionate Software Engineering student with a deep fascination for Artificial
                Intelligence, Machine Learning,NLP, Computer Vision and Full Stack Development. I
                love building intelligent, scalable applications that solve real-world problems and
                create meaningful impact.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="leading-relaxed text-white/60"
              >
                When I'm not coding, you'll find me traveling to new destinations, capturing moments
                through photography, and exploring the beauty of different cultures and landscapes.
              </motion.p>
            </div>
          </div>
        </div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {statsData.map((stat, index) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              label={stat.label}
              icon={stat.icon}
              delay={0.4 + index * 0.08}
            />
          ))}
        </motion.div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-20 text-center"
        >
          <div className="relative inline-block">
            <span className="absolute -top-8 -left-8 text-6xl text-[#45A9A9]/20">"</span>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-white/80 italic sm:text-2xl">
              The best way to predict the future is to create it.
            </p>
            <span className="absolute -right-8 -bottom-12 text-6xl text-[#45A9A9]/20">"</span>
          </div>
          <p className="mt-6 text-sm text-white/40">— Peter Drucker</p>
        </motion.div>
      </div>
    </section>
  );
}
