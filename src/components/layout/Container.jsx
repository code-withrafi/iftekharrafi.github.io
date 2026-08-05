import { forwardRef } from 'react';
import { motion } from 'framer-motion';

// Size variants for different container widths
const sizeClasses = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-[90rem]',
  full: 'max-w-full',
  narrow: 'max-w-2xl',
};

// Padding variants for different spacing needs
const paddingClasses = {
  none: 'px-0',
  sm: 'px-4 sm:px-6 lg:px-8',
  md: 'px-6 sm:px-8 lg:px-12',
  lg: 'px-8 sm:px-12 lg:px-16',
};

const Container = forwardRef(
  (
    {
      children,
      className = '',
      size = 'lg',
      padding = 'md',
      as: Component = 'div',
      animated = false,
      animationVariant = 'fadeUp',
      noGutter = false,
      centered = false,
      id,
      role,
      ariaLabel,
      ...props
    },
    ref,
  ) => {
    // Animation variants
    const animations = {
      fadeUp: {
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: 'easeOut' },
      },
      fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.5, ease: 'easeOut' },
      },
      slideLeft: {
        initial: { opacity: 0, x: -40 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.6, ease: 'easeOut' },
      },
      slideRight: {
        initial: { opacity: 0, x: 40 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.6, ease: 'easeOut' },
      },
      scale: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.5, ease: 'easeOut' },
      },
      none: {},
    };

    const selectedAnimation = animations[animationVariant] || animations.fadeUp;

    // Build class names
    const containerClasses = [
      'mx-auto w-full',
      sizeClasses[size] || sizeClasses.lg,
      !noGutter && (paddingClasses[padding] || paddingClasses.md),
      centered && 'flex flex-col items-center text-center',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // If animated, use motion component
    if (animated) {
      const MotionComponent = motion[Component] || motion.div;

      return (
        <MotionComponent
          ref={ref}
          className={containerClasses}
          initial={selectedAnimation.initial}
          animate={selectedAnimation.animate}
          transition={selectedAnimation.transition}
          viewport={animationVariant !== 'none' ? { once: true, margin: '-50px' } : undefined}
          id={id}
          role={role}
          aria-label={ariaLabel}
          {...props}
        >
          {children}
        </MotionComponent>
      );
    }

    // Static container
    return (
      <Component
        ref={ref}
        className={containerClasses}
        id={id}
        role={role}
        aria-label={ariaLabel}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

Container.displayName = 'Container';

// Section container with semantic HTML
export function Section({
  children,
  className = '',
  background = 'default',
  spacing = 'lg',
  ...props
}) {
  const backgroundClasses = {
    default: '',
    muted: 'bg-gray-50/50 dark:bg-gray-900/50',
    accent: 'bg-[#45A9A9]/5 dark:bg-[#45A9A9]/10',
    gradient: 'bg-gradient-to-b from-transparent via-[#45A9A9]/5 to-transparent',
    dark: 'bg-gray-900 dark:bg-black',
  };

  const spacingClasses = {
    none: 'py-0',
    sm: 'py-8 sm:py-12',
    md: 'py-12 sm:py-16',
    lg: 'py-16 sm:py-20 lg:py-24',
    xl: 'py-20 sm:py-24 lg:py-32',
  };

  return (
    <section
      className={`${spacingClasses[spacing]} ${backgroundClasses[background]} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}

// Grid container for common layouts
export function Grid({ children, className = '', cols = 3, gap = 'md', ...props }) {
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  };

  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-4',
    md: 'gap-6 lg:gap-8',
    lg: 'gap-8 lg:gap-12',
    xl: 'gap-12 lg:gap-16',
  };

  return (
    <div className={`grid ${colsClasses[cols]} ${gapClasses[gap]} ${className}`} {...props}>
      {children}
    </div>
  );
}

// Flex container for common layouts
export function Flex({
  children,
  className = '',
  direction = 'row',
  align = 'center',
  justify = 'between',
  wrap = false,
  gap = 'md',
  ...props
}) {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse',
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2 sm:gap-4',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8 lg:gap-10',
    xl: 'gap-8 sm:gap-12 lg:gap-16',
  };

  return (
    <div
      className={`flex ${directionClasses[direction]} ${alignClasses[align]} ${justifyClasses[justify]} ${wrap ? 'flex-wrap' : ''} ${gapClasses[gap]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Container;
