import { motion } from 'framer-motion';
import { FiHeart, FiArrowUp } from 'react-icons/fi';
import { useState, useEffect, useCallback, useMemo } from 'react';

// Memoized current year
const currentYear = new Date().getFullYear();

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Optimized scroll listener
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setShowScrollTop(window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Memoize navigation links
  const navLinks = useMemo(() => ['Home', 'About', 'Projects', 'Skills', 'Contact'], []);

  return (
    <>
      <footer className="relative mt-20 border-t border-white/5 bg-[#0a0f1a] py-12">
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
          {/* Main Footer Content */}
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Brand Section */}
            <div className="space-y-4">
              <h3 className="bg-gradient-to-r from-[#44a9a9] to-[#98E8DE] bg-clip-text text-2xl font-bold text-transparent">
                Rafi
              </h3>
              <p className="max-w-sm text-sm leading-relaxed text-white/50">
                Building digital experiences with passion and creativity.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold tracking-wider text-white/80 uppercase">
                Quick Links
              </h4>
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link}
                    href={`#${link.toLowerCase()}`}
                    className="group inline-flex items-center gap-1 text-sm text-white/40 transition-all duration-200 hover:translate-x-1 hover:text-[#45A9A9]"
                  >
                    <span className="h-px w-0 bg-[#45A9A9] transition-all duration-300 group-hover:w-2" />
                    {link}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#0a0f1a] px-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <FiHeart className="h-4 w-4 text-[#45A9A9]" />
                </motion.div>
              </span>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="text-center">
            <p className="text-sm text-white/40">© {currentYear} Iftekhar Ibne Masud Rafi</p>
          </div>
        </div>

        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[#45A9A9]/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-[#98E8DE]/5 blur-3xl" />
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed right-8 bottom-8 z-50 rounded-full bg-gradient-to-r from-[#45A9A9] to-[#98E8DE] p-3 text-white shadow-lg shadow-[#45A9A9]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[#45A9A9]/40"
          aria-label="Scroll to top"
        >
          <FiArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </>
  );
}
