import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { FiArrowDown } from 'react-icons/fi';
import Button from '@/components/common/Button';
import ResumeButton from '@/components/common/ResumeButton';

// Animated counter for stats - OPTIMIZED
function AnimatedCounter({ value, label, duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing once visible
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const end = parseInt(value);
    const increment = end / (duration * 60);
    let frameId;

    const animate = () => {
      start += increment;
      if (start >= end) {
        setCount(end);
        return;
      }
      setCount(Math.floor(start));
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isVisible, value, duration]);

  return (
    <div ref={ref} className="text-center">
      <div className="bg-gradient-to-r from-[#45A9A9] to-[#98E8DE] bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
        {count}+
      </div>
      <div className="mt-1 text-sm text-white/50">{label}</div>
    </div>
  );
}

// Floating shapes for background - OPTIMIZED (reduced to 2 shapes)
function FloatingShapes() {
  // Use static shapes instead of animated ones for better performance
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Static circle */}
      <div className="absolute top-20 left-[10%] h-72 w-72 rounded-full border border-[#45A9A9]/5" />

      {/* Static diamond */}
      <div className="absolute top-40 right-[15%] h-48 w-48 rotate-45 border border-[#98E8DE]/5" />
    </div>
  );
}

// Scroll indicator - SIMPLIFIED
function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 0.6 }}
      className="absolute bottom-12 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
    >
      <span className="text-xs tracking-widest text-white/30 uppercase">Scroll</span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        className="flex h-8 w-5 items-start justify-center rounded-full border border-white/20 p-1"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="h-1 w-1 rounded-full bg-[#45A9A9]"
        />
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Use transform with GPU-accelerated properties only
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']); // Reduced from 50%
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Simplified mouse parallax - lower values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Use useCallback to prevent recreation
  const handleMouseMove = useCallback(
    (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX / innerWidth - 0.5) * 10); // Reduced from 20
      mouseY.set((clientY / innerHeight - 0.5) * 10); // Reduced from 20
    },
    [mouseX, mouseY],
  );

  // Memoize variants to prevent recreation
  const textVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 30 }, // Reduced from 50
      visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
          delay: 0.3 + i * 0.1,
          duration: 0.6, // Reduced from 0.8
          ease: [0.25, 0.1, 0.25, 1],
        },
      }),
    }),
    [],
  );

  const fadeInVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 20 }, // Reduced from 30
      visible: {
        opacity: 1,
        y: 0,
        transition: { delay: 0.8, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }, // Reduced from 0.8
      },
    }),
    [],
  );

  // Memoize title characters
  const titleText = useMemo(() => 'Software Engineer', []);
  const titleChars = useMemo(() => titleText.split(''), [titleText]);

  return (
    <section
      ref={containerRef}
      id="home"
      onMouseMove={handleMouseMove}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{ willChange: 'transform' }} // Hint for GPU acceleration
    >
      {/* Floating background shapes */}
      <FloatingShapes />

      {/* Grid background - static */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(69, 169, 169, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(69, 169, 169, 0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
        aria-hidden="true"
      />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20 md:px-12 lg:px-16"
      >
        <div className="max-w-5xl">
          {/* Greeting */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="mb-6 flex items-center gap-3"
          >
            <span className="h-px w-12 bg-gradient-to-r from-[#45A9A9] to-transparent" />
            <p className="text-lg font-medium tracking-widest text-[#45A9A9] uppercase">
              Hello, I'm
            </p>
          </motion.div>

          {/* Name - simplified animation */}
          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="text-6xl leading-none font-black tracking-tight sm:text-7xl md:text-8xl lg:text-9xl"
          >
            <span className="relative inline-block">
              Iftekhar
              <span
                className="absolute -inset-4 rounded-full bg-[#F6F5F5]/10 blur-3xl"
                aria-hidden="true"
              />
            </span>
            <br />
            <span className="relative inline-block">Rafi</span>
          </motion.h1>

          {/* Animated title - simplified with fewer spans */}
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="mt-6"
          >
            <span className="bg-gradient-to-r from-[#45A9A9] to-[#98E8DE] bg-clip-text text-4xl font-bold text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
              {titleChars.map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 1.2 + index * 0.03,
                    duration: 0.3,
                    ease: 'easeOut',
                  }}
                  className={char === ' ' ? 'mr-4' : ''}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </motion.div>

          {/* Description - simplified */}
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
            className="mt-8 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl"
          >
            Passionate about{','}
            <span className="text-[#45A9A9]">Web Development</span>,{' '}
            <span className="text-[#45A9A9]">Artificial Intelligence </span>, and building digital
            experiences that make a difference.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Button>
              <span className="flex items-center gap-2">
                View Projects
                <FiArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              </span>
            </Button>
            <ResumeButton />
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.6 }}
            className="mt-16 flex flex-wrap gap-8 sm:gap-12"
          >
            <AnimatedCounter value="10" label="Projects" />
            <AnimatedCounter value="5" label="Technologies" />
            <AnimatedCounter value="2" label="Years Coding" />
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <ScrollIndicator />
    </section>
  );
}
