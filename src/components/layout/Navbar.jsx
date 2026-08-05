import { useState, useEffect, useRef } from 'react';
import { navigation } from '@/constants/navigation';
import useScrollSpy from '@/hooks/useScrollSpy';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';

// Magnetic button effect for CTA
function MagneticButton({ children, href, className = '' }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.3;
    const y = (clientY - (top + height / 2)) * 0.3;
    setPosition({ x, y });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.a>
  );
}

// Nav link with hover effect
function NavLink({ item, isActive, index, onHover, onLeave }) {
  return (
    <motion.a
      href={item.href}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 * index, ease: [0.25, 0.1, 0.25, 1] }}
      onMouseEnter={() => onHover(item.name)}
      onMouseLeave={onLeave}
      className="group relative px-4 py-2"
    >
      {/* Background hover effect */}
      <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#45A9A9]/0 to-[#98E8DE]/0 transition-all duration-500 group-hover:from-[#45A9A9]/10 group-hover:to-[#98E8DE]/10" />

      {/* Text */}
      <span
        className={`relative z-10 text-sm font-medium transition-all duration-300 ${
          isActive ? 'text-[#45A9A9]' : 'text-white/70 group-hover:text-white'
        }`}
      >
        {/* Number prefix */}
        <span className="mr-1 text-xs text-[#45A9A9] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          0{index + 1}.
        </span>
        {item.name}
      </span>

      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#45A9A9]"
          transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
        />
      )}

      {/* Hover line animation */}
      <span className="absolute right-4 bottom-0 left-4 h-px origin-center scale-x-0 bg-gradient-to-r from-[#45A9A9] to-[#98E8DE] transition-transform duration-500 group-hover:scale-x-100" />
    </motion.a>
  );
}

export default function Navbar() {
  const active = useScrollSpy(navigation.map((item) => item.href.replace('#', '')));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true); // Start with dark mode

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed top-0 z-50 w-full"
      >
        <div
          className={`mx-auto transition-all duration-700 ${
            isScrolled
              ? 'mt-4 max-w-5xl rounded-2xl border border-white/10 bg-white/5 shadow-2xl shadow-black/20 backdrop-blur-2xl'
              : 'mt-0 max-w-full border-transparent bg-transparent'
          }`}
        >
          <div className="flex items-center justify-between px-6 py-4 lg:px-8">
            {/* Logo */}
            <motion.a
              href="#"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="group relative"
            >
              <div className="relative">
                {/* Logo glow */}
                <div className="absolute -inset-3 rounded-full bg-[#45A9A9]/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

                <h2 className="relative text-2xl font-black tracking-tight sm:text-3xl">
                  <span className="animate-gradient bg-gradient-to-r from-[#45A9A9] via-[#98E8DE] to-[#45A9A9] bg-[length:200%_100%] bg-clip-text text-transparent">
                    Code With Rafi
                  </span>
                  <span className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r from-[#45A9A9] to-[#98E8DE] transition-transform duration-500 group-hover:scale-x-100" />
                </h2>
              </div>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-2 md:flex">
              {navigation.map((item, index) => (
                <NavLink
                  key={item.href}
                  item={item}
                  index={index}
                  isActive={active === item.href.substring(1)}
                  onHover={setHoveredItem}
                  onLeave={() => setHoveredItem(null)}
                />
              ))}
            </div>

            {/* Mobile menu button */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm md:hidden"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiX className="h-5 w-5 text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiMenu className="h-5 w-5 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xl md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed inset-4 z-40 overflow-y-auto rounded-3xl border border-white/10 bg-[#0a1628] shadow-2xl md:hidden"
            >
              <div className="flex min-h-full flex-col p-8">
                {/* Header */}
                <div className="mb-12 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Navigation</h3>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5"
                  >
                    <FiX className="h-5 w-5 text-white" />
                  </button>
                </div>

                {/* Links */}
                <nav className="flex flex-1 flex-col gap-1">
                  {navigation.map((item, index) => {
                    const isActive = active === item.href.substring(1);
                    return (
                      <motion.a
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.05 * index }}
                        className={`group relative rounded-2xl px-6 py-4 text-lg font-medium transition-all duration-300 ${
                          isActive
                            ? 'bg-[#45A9A9]/10 text-[#45A9A9]'
                            : 'text-white/60 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-4">
                          <span className="font-mono text-sm text-[#45A9A9]">0{index + 1}</span>
                          {item.name}
                        </span>

                        {isActive && (
                          <span className="absolute top-1/2 right-6 h-2 w-2 -translate-y-1/2 rounded-full bg-[#45A9A9]" />
                        )}

                        <span className="absolute right-6 bottom-0 left-6 h-px scale-x-0 bg-gradient-to-r from-[#45A9A9]/50 to-transparent transition-transform duration-500 group-hover:scale-x-100" />
                      </motion.a>
                    );
                  })}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add gradient animation to your globals.css */}
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </>
  );
}
