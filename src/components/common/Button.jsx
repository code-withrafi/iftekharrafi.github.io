import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

// Magnetic button effect
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

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  magnetic = true,
  disabled = false,
  className = '',
  ...props
}) {
  // Variant styles
  const variants = {
    primary: {
      base: 'bg-gradient-to-r from-[#45A9A9] to-[#45A9A9] hover:from-[#45A9A9] hover:to-[#3D8F8F] text-white',
      shadow: 'shadow-lg shadow-[#45A9A9]/25 hover:shadow-xl hover:shadow-[#45A9A9]/40',
      border: 'border border-[#45A9A9]/0',
    },
    secondary: {
      base: 'bg-white/5 backdrop-blur-sm text-white hover:bg-white/10',
      shadow: 'shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20',
      border: 'border border-white/10 hover:border-white/20',
    },
    outline: {
      base: 'bg-transparent text-[#45A9A9] hover:bg-[#45A9A9]/10',
      shadow: 'shadow-none hover:shadow-lg hover:shadow-[#45A9A9]/20',
      border: 'border-2 border-[#45A9A9]/50 hover:border-[#45A9A9]',
    },
    ghost: {
      base: 'bg-transparent text-white/60 hover:text-white hover:bg-white/5',
      shadow: 'shadow-none',
      border: 'border border-transparent',
    },
    gradient: {
      base: 'bg-gradient-to-r from-[#45A9A9] via-[#45A9A9] to-[#98E8DE] bg-[length:200%_100%] hover:bg-right text-white',
      shadow: 'shadow-lg shadow-[#45A9A9]/25 hover:shadow-xl hover:shadow-[#45A9A9]/40',
      border: 'border border-transparent',
    },
  };

  // Size styles
  const sizes = {
    sm: 'px-5 py-2 text-sm gap-1.5',
    md: 'px-8 py-3 text-base gap-2',
    lg: 'px-10 py-4 text-lg gap-3',
    xl: 'px-12 py-5 text-xl gap-3',
  };

  const selectedVariant = variants[variant] || variants.primary;
  const selectedSize = sizes[size] || sizes.md;

  const buttonContent = (
    <button
      disabled={disabled}
      className={`group relative inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-500 ease-out ${selectedVariant.base} ${selectedVariant.shadow} ${selectedVariant.border} ${selectedSize} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className} `}
      {...props}
    >
      {/* Background shine effect */}
      <span className="absolute inset-0 overflow-hidden rounded-xl">
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
      </span>

      {/* Hover glow */}
      <span className="absolute -inset-1 rounded-xl bg-gradient-to-r from-[#45A9A9]/0 to-[#98E8DE]/0 opacity-0 blur-xl transition-all duration-500 group-hover:from-[#45A9A9]/30 group-hover:to-[#98E8DE]/30 group-hover:opacity-100" />

      {/* Ripple effect on click */}
      <span className="absolute inset-0 overflow-hidden rounded-xl">
        <span className="absolute inset-0 scale-0 rounded-xl bg-white/20 transition-all duration-500 group-active:scale-100 group-active:opacity-0" />
      </span>

      {/* Border animation */}
      <span className="absolute inset-0 rounded-xl border-2 border-transparent transition-all duration-500 group-hover:border-[#45A9A9]/30" />

      {/* Content */}
      <span className="relative z-10 flex items-center font-semibold tracking-wide">
        {children}
      </span>
    </button>
  );

  // Wrap with magnetic effect if enabled
  if (magnetic) {
    return <MagneticWrapper>{buttonContent}</MagneticWrapper>;
  }

  return buttonContent;
}

// Specialized button components
export function PrimaryButton({ children, ...props }) {
  return (
    <Button variant="primary" {...props}>
      {children}
    </Button>
  );
}

export function SecondaryButton({ children, ...props }) {
  return (
    <Button variant="secondary" {...props}>
      {children}
    </Button>
  );
}

export function OutlineButton({ children, ...props }) {
  return (
    <Button variant="outline" {...props}>
      {children}
    </Button>
  );
}

export function GradientButton({ children, ...props }) {
  return (
    <Button variant="gradient" {...props}>
      {children}
    </Button>
  );
}

// Icon Button
export function IconButton({ icon: Icon, label, href, ...props }) {
  return (
    <Button variant="secondary" size="sm" {...props}>
      {Icon && <Icon className="h-4 w-4" />}
      {label}
    </Button>
  );
}

// Link Button
export function LinkButton({ children, href, external = false, ...props }) {
  const Component = href ? motion.a : motion.button;

  return (
    <Component
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="group inline-flex items-center gap-2 font-medium text-[#45A9A9] transition-colors duration-300 hover:text-[#98E8DE]"
      whileHover={{ x: 3 }}
      {...props}
    >
      {children}
      <svg
        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 8l4 4m0 0l-4 4m4-4H3"
        />
      </svg>
    </Component>
  );
}
