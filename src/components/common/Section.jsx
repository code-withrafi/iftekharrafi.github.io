import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const SECTION_VARIANTS = {
  default: '',
  dark: 'bg-[#06151D]',
  darker: 'bg-[#040e14]',
  glass: 'bg-white/[0.02] backdrop-blur-sm',
  gradient: 'bg-gradient-to-b from-transparent via-[#45A9A9]/5 to-transparent',
  bordered: 'border-y border-white/5',
};

const SPACING = {
  none: 'py-0',
  sm: 'py-12 sm:py-16',
  md: 'py-24 sm:py-32',
  lg: 'py-32 sm:py-40',
  xl: 'py-40 sm:py-48',
};

const CONTAINER = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-[90rem]',
  full: 'max-w-full',
};

const ANIMATIONS = {
  fadeUp: {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  slideLeft: {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
  },
  slideRight: {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
  },
  none: {
    initial: {},
    animate: {},
  },
};

const cn = (...classes) => classes.filter(Boolean).join(' ');

const Section = ({
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
}) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, {
    once: true,
    margin: '-100px',
  });

  const animation = ANIMATIONS[animationVariant] || ANIMATIONS.fadeUp;

  const sectionClasses = cn(
    'relative overflow-hidden',
    SECTION_VARIANTS[variant] || SECTION_VARIANTS.default,
    SPACING[spacing] || SPACING.md,
    className,
  );

  const content = noContainer ? (
    children
  ) : fullWidth ? (
    <div className="w-full">{children}</div>
  ) : (
    <div
      className={cn(
        'mx-auto w-full',
        CONTAINER[containerSize] || CONTAINER.lg,
        'px-6 sm:px-8 lg:px-12',
      )}
    >
      {children}
    </div>
  );

  const contentWithAnimation =
    animated && animationVariant !== 'none' ? (
      <motion.div
        initial={animation.initial}
        animate={isInView ? animation.animate : {}}
        transition={{
          duration: 0.8,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        {content}
      </motion.div>
    ) : (
      content
    );

  return (
    <Component
      ref={animated ? sectionRef : undefined}
      id={id}
      className={sectionClasses}
      {...props}
    >
      {contentWithAnimation}
    </Component>
  );
};

Section.displayName = 'Section';

export function FullBleedSection({ children, className = '', ...props }) {
  return (
    <Section spacing="none" noContainer fullWidth animated={false} className={className} {...props}>
      {children}
    </Section>
  );
}

export function GlassSection({ children, className = '', ...props }) {
  return (
    <Section variant="glass" className={className} {...props}>
      {children}
    </Section>
  );
}

export function GradientSection({ children, className = '', ...props }) {
  return (
    <Section variant="gradient" className={className} {...props}>
      {children}
    </Section>
  );
}

export function BorderedSection({ children, className = '', ...props }) {
  return (
    <Section variant="bordered" className={className} {...props}>
      {children}
    </Section>
  );
}

export function NarrowSection({ children, className = '', ...props }) {
  return (
    <Section containerSize="sm" className={className} {...props}>
      {children}
    </Section>
  );
}

export function WideSection({ children, className = '', ...props }) {
  return (
    <Section containerSize="xl" className={className} {...props}>
      {children}
    </Section>
  );
}

export function SpaciousSection({ children, className = '', ...props }) {
  return (
    <Section spacing="xl" className={className} {...props}>
      {children}
    </Section>
  );
}

export function CompactSection({ children, className = '', ...props }) {
  return (
    <Section spacing="sm" className={className} {...props}>
      {children}
    </Section>
  );
}

export default Section;
