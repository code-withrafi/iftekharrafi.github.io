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
  sm: 'py-8 sm:py-10 lg:py-12',
  md: 'py-10 sm:py-14 lg:py-16',
  lg: 'py-12 sm:py-16 lg:py-20',
  xl: 'py-16 sm:py-20 lg:py-24',
};

const CONTAINER = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-[90rem]',
  full: 'max-w-full',
};

const CONTAINER_PADDING = {
  none: 'px-0',
  sm: 'px-4 sm:px-6 lg:px-8',
  md: 'px-4 sm:px-6 lg:px-8 xl:px-10',
  lg: 'px-5 sm:px-8 lg:px-10 xl:px-12',
};

const ANIMATIONS = {
  fadeUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  slideLeft: {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
  },
  slideRight: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.97 },
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
  containerPadding = 'md',
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
    margin: '-80px',
  });

  const animation = ANIMATIONS[animationVariant] || ANIMATIONS.fadeUp;

  const sectionClasses = cn(
    'relative isolate w-full min-w-0',
    'box-border',
    SECTION_VARIANTS[variant] || SECTION_VARIANTS.default,
    SPACING[spacing] || SPACING.md,
    className,
  );

  const content = noContainer ? (
    children
  ) : (
    <div
      className={cn(
        'mx-auto w-full min-w-0',
        'box-border',
        CONTAINER[containerSize] || CONTAINER.lg,
        !fullWidth && (CONTAINER_PADDING[containerPadding] || CONTAINER_PADDING.md),
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
          duration: 0.7,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        className="w-full min-w-0"
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
