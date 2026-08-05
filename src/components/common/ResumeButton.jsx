import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiFileText, FiCheck, FiLoader, FiEye } from 'react-icons/fi';
import resume from '@/assets/resume/Rafi_Resume.pdf';

// Magnetic wrapper for button
function MagneticWrapper({ children, className = '' }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.4;
    const y = (clientY - (top + height / 2)) * 0.4;
    setPosition({ x, y });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.2 }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function ResumeButton({
  variant = 'outline',
  size = 'md',
  showIcon = true,
  magnetic = true,
  className = '',
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  // Handle download with animation
  const handleDownload = async () => {
    if (isDownloading || isDownloaded) return;

    setIsDownloading(true);

    // Simulate download delay (optional, for UX)
    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsDownloading(false);
    setIsDownloaded(true);

    // Reset after animation
    setTimeout(() => {
      setIsDownloaded(false);
    }, 2000);
  };

  // Variant styles
  const variants = {
    outline: {
      base: 'border-2 border-[#45A9A9]/50 text-[#45A9A9] hover:border-[#45A9A9] hover:bg-[#45A9A9] hover:text-white',
      shadow: 'hover:shadow-lg hover:shadow-[#45A9A9]/25',
    },
    solid: {
      base: 'border-2 border-[#45A9A9] bg-[#45A9A9] text-white hover:bg-[#3D8F8F] hover:border-[#3D8F8F]',
      shadow: 'shadow-lg shadow-[#45A9A9]/25 hover:shadow-xl hover:shadow-[#45A9A9]/40',
    },
    gradient: {
      base: 'border-2 border-transparent bg-gradient-to-r from-[#45A9A9] to-[#98E8DE] text-white hover:from-[#3D8F8F] hover:to-[#7BC8C8]',
      shadow: 'shadow-lg shadow-[#45A9A9]/25 hover:shadow-xl hover:shadow-[#45A9A9]/40',
    },
    ghost: {
      base: 'border-2 border-transparent text-white/60 hover:text-white hover:bg-white/5',
      shadow: '',
    },
    glass: {
      base: 'border border-white/10 bg-white/5 backdrop-blur-sm text-white hover:border-[#45A9A9]/30 hover:bg-[#45A9A9]/10 hover:text-[#45A9A9]',
      shadow: 'hover:shadow-lg hover:shadow-[#45A9A9]/10',
    },
  };

  // Size styles
  const sizes = {
    sm: 'px-4 py-2 text-sm gap-1.5 rounded-lg',
    md: 'px-6 py-3 text-base gap-2 rounded-xl',
    lg: 'px-8 py-4 text-lg gap-3 rounded-xl',
  };

  const selectedVariant = variants[variant] || variants.outline;
  const selectedSize = sizes[size] || sizes.md;

  const buttonContent = (
    <a
      href={resume}
      download="Rafi_Resume.pdf"
      onClick={handleDownload}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative inline-flex cursor-pointer items-center justify-center font-semibold transition-all duration-500 ease-out ${selectedVariant.base} ${selectedVariant.shadow} ${selectedSize} ${className} `}
    >
      {/* Background shine effect */}
      <span className="absolute inset-0 overflow-hidden rounded-xl">
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
      </span>

      {/* Hover glow */}
      <span className="absolute -inset-1 rounded-xl bg-gradient-to-r from-[#45A9A9]/0 to-[#98E8DE]/0 opacity-0 blur-xl transition-all duration-500 group-hover:from-[#45A9A9]/20 group-hover:to-[#98E8DE]/20 group-hover:opacity-100" />

      {/* Ripple effect on click */}
      <span className="absolute inset-0 overflow-hidden rounded-xl">
        <span className="absolute inset-0 scale-0 rounded-xl bg-white/20 transition-all duration-500 group-active:scale-100 group-active:opacity-0" />
      </span>

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        <AnimatePresence mode="wait">
          {isDownloading ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <FiLoader className="h-4 w-4 sm:h-5 sm:w-5" />
              </motion.div>
            </motion.span>
          ) : isDownloaded ? (
            <motion.span
              key="check"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <FiCheck className="h-4 w-4 sm:h-5 sm:w-5" />
            </motion.span>
          ) : showIcon ? (
            <motion.span
              key="download"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="transition-transform duration-300 group-hover:translate-y-0.5"
            >
              <FiDownload className="h-4 w-4 sm:h-5 sm:w-5" />
            </motion.span>
          ) : null}
        </AnimatePresence>

        <span>
          {isDownloading ? 'Downloading...' : isDownloaded ? 'Downloaded!' : 'Download Resume'}
        </span>
      </span>
    </a>
  );

  // Wrap with magnetic effect if enabled
  if (magnetic) {
    return <MagneticWrapper>{buttonContent}</MagneticWrapper>;
  }

  return buttonContent;
}

// Quick variant buttons
export function OutlineResumeButton(props) {
  return <ResumeButton variant="outline" {...props} />;
}

export function SolidResumeButton(props) {
  return <ResumeButton variant="solid" {...props} />;
}

export function GradientResumeButton(props) {
  return <ResumeButton variant="gradient" {...props} />;
}

export function GlassResumeButton(props) {
  return <ResumeButton variant="glass" {...props} />;
}

// View Resume Button (opens in new tab instead of downloading)
export function ViewResumeButton({
  variant = 'outline',
  size = 'md',
  magnetic = true,
  className = '',
}) {
  const [isHovered, setIsHovered] = useState(false);

  const variants = {
    outline: {
      base: 'border-2 border-white/20 text-white/60 hover:border-[#45A9A9]/50 hover:text-[#45A9A9] hover:bg-[#45A9A9]/5',
      shadow: '',
    },
    glass: {
      base: 'border border-white/10 bg-white/5 backdrop-blur-sm text-white/60 hover:border-[#45A9A9]/30 hover:bg-[#45A9A9]/10 hover:text-[#45A9A9]',
      shadow: 'hover:shadow-lg hover:shadow-[#45A9A9]/10',
    },
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm gap-1.5 rounded-lg',
    md: 'px-6 py-3 text-base gap-2 rounded-xl',
    lg: 'px-8 py-4 text-lg gap-3 rounded-xl',
  };

  const selectedVariant = variants[variant] || variants.outline;
  const selectedSize = sizes[size] || sizes.md;

  const buttonContent = (
    <a
      href={resume}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative inline-flex cursor-pointer items-center justify-center font-semibold transition-all duration-500 ease-out ${selectedVariant.base} ${selectedVariant.shadow} ${selectedSize} ${className} `}
    >
      <span className="relative z-10 flex items-center gap-2">
        <FiEye className="h-4 w-4 transition-transform duration-300 group-hover:scale-110 sm:h-5 sm:w-5" />
        <span>View Resume</span>
        <FiFileText className="h-4 w-4 -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:h-5 sm:w-5" />
      </span>
    </a>
  );

  if (magnetic) {
    return <MagneticWrapper>{buttonContent}</MagneticWrapper>;
  }

  return buttonContent;
}
