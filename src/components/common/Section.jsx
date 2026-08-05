import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// Section variants for different styles
const sectionVariants = {
  default: {
    background: '',
    spacing: 'py-24 sm:py-32',
  },
  dark: {
    background: 'bg-[#06151D]',
    spacing: 'py-24 sm:py-32',
  },
  darker: {
    background: 'bg-[#040e14]',
    spacing: 'py-24 sm:py-32',
  },
  glass: {
    background: 'bg-white/[0.02] backdrop-blur-sm',
    spacing: 'py-24 sm:py-32',
  },
  gradient: {
    background: 'bg-gradient-to-b from-transparent via-[#45A9A9]/5 to-transparent',
    spacing: 'py-24 sm:py-32',
  },
  bordered: {
    background: 'border-y border-white/5',
    spacing: 'py-24 sm:py-32',
  },
};

// Spacing variants
const spacingVariants = {
  none: 'py-0',
  sm: 'py-12 sm:py-16',
  md: 'py-24 sm:py-32',
  lg: 'py-32 sm:py-40',
  xl: 'py-40 sm:py-48',
};

// Container sizes
const containerSizes = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-[90rem]',
  full: 'max-w-full',
};

export default function Section({
  id,
  children,
  className = '',
  variant = 'default',
  spacing = 'md',
  containerSize = 'lg',
  animated = true,
  animationVariant = 'fadeUp',
  as: Component = 'section',
  noContainer = false,
  fullWidth = false,
  ...props
}) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Animation variants
  const animations = {
    fadeUp: {
      initial: { opacity: 0, y: 60 },
      animate: isInView ? { opacity: 1, y: 0 } : {},
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
    },
    fadeIn: {
      initial: { opacity: 0 },
      animate: isInView ? { opacity: 1 } : {},
      transition: { duration: 0.8, ease: 'easeOut' },
    },
    slideLeft: {
      initial: { opacity: 0, x: -60 },
      animate: isInView ? { opacity: 1, x: 0 } : {},
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
    },
    slideRight: {
      initial: { opacity: 0, x: 60 },
      animate: isInView ? { opacity: 1, x: 0 } : {},
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
    },
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: isInView ? { opacity: 1, scale: 1 } : {},
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
    },
    none: {},
  };

  const selectedAnimation = animations[animationVariant] || animations.fadeUp;
  const selectedVariant = sectionVariants[variant] || sectionVariants.default;
  const selectedSpacing = spacingVariants[spacing] || spacingVariants.md;
  const selectedContainer = containerSizes[containerSize] || containerSizes.lg;

  const sectionContent = (
    <>
      {noContainer ? (
        children
      ) : fullWidth ? (
        <div className="w-full">{children}</div>
      ) : (
        <div className={`mx-auto w-full ${selectedContainer} px-6 sm:px-8 lg:px-12`}>
          {children}
        </div>
      )}
    </>
  );

  if (animated && animationVariant !== 'none') {
    return (
      <Component
        ref={sectionRef}
        id={id}
        className={`relative overflow-hidden ${selectedVariant.background} ${selectedSpacing} ${className}`}
        {...props}
      >
        <motion.div
          initial={selectedAnimation.initial}
          animate={selectedAnimation.animate}
          transition={selectedAnimation.transition}
        >
          {sectionContent}
        </motion.div>
      </Component>
    );
  }

  return (
    <Component
      id={id}
      className={`relative overflow-hidden ${selectedVariant.background} ${selectedSpacing} ${className}`}
      {...props}
    >
      {sectionContent}
    </Component>
  );
}

// Specialized section components for quick use

// Full-bleed section (no padding, no container)
export function FullBleedSection({ children, className = '', ...props }) {
  return (
    <Section spacing="none" noContainer fullWidth animated={false} className={className} {...props}>
      {children}
    </Section>
  );
}

// Dark section with glass effect
export function GlassSection({ children, className = '', ...props }) {
  return (
    <Section variant="glass" className={className} {...props}>
      {children}
    </Section>
  );
}

// Gradient background section
export function GradientSection({ children, className = '', ...props }) {
  return (
    <Section variant="gradient" className={className} {...props}>
      {children}
    </Section>
  );
}

// Bordered section with divider lines
export function BorderedSection({ children, className = '', ...props }) {
  return (
    <Section variant="bordered" className={className} {...props}>
      {children}
    </Section>
  );
}

// Narrow content section (blog-style)
export function NarrowSection({ children, className = '', ...props }) {
  return (
    <Section containerSize="sm" className={className} {...props}>
      {children}
    </Section>
  );
}

// Wide section for grids
export function WideSection({ children, className = '', ...props }) {
  return (
    <Section containerSize="xl" className={className} {...props}>
      {children}
    </Section>
  );
}

// Section with large spacing
export function SpaciousSection({ children, className = '', ...props }) {
  return (
    <Section spacing="xl" className={className} {...props}>
      {children}
    </Section>
  );
}

// Compact section
export function CompactSection({ children, className = '', ...props }) {
  return (
    <Section spacing="sm" className={className} {...props}>
      {children}
    </Section>
  );
}
