import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const SIZE = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-[90rem]',
  full: 'max-w-full',
  narrow: 'max-w-2xl',
};

const PADDING = {
  none: 'px-0',
  sm: 'px-4 sm:px-6 lg:px-8',
  md: 'px-4 sm:px-6 lg:px-8 xl:px-10',
  lg: 'px-5 sm:px-8 lg:px-10 xl:px-12',
};

const ANIMATIONS = {
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

const GRID_COLS = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
  6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
};

const GAPS = {
  none: 'gap-0',
  sm: 'gap-4',
  md: 'gap-5 sm:gap-6 lg:gap-8',
  lg: 'gap-6 sm:gap-8 lg:gap-10',
  xl: 'gap-8 sm:gap-10 lg:gap-12',
};

const FLEX_DIRECTION = {
  row: 'flex-row',
  col: 'flex-col',
  'row-reverse': 'flex-row-reverse',
  'col-reverse': 'flex-col-reverse',
};

const ALIGN = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

const JUSTIFY = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

const FLEX_GAPS = {
  none: 'gap-0',
  sm: 'gap-2 sm:gap-3',
  md: 'gap-3 sm:gap-4 lg:gap-5',
  lg: 'gap-4 sm:gap-6 lg:gap-8',
  xl: 'gap-6 sm:gap-8 lg:gap-10',
};

const cn = (...classes) => classes.filter(Boolean).join(' ');

const Container = forwardRef(function Container(
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
) {
  const animation = ANIMATIONS[animationVariant] || ANIMATIONS.fadeUp;

  const classes = cn(
    'mx-auto w-full min-w-0',
    SIZE[size] || SIZE.lg,
    !noGutter && (PADDING[padding] || PADDING.md),
    centered && 'flex flex-col items-center text-center',
    className,
  );

  if (animated) {
    const MotionComponent = motion[Component] || motion.div;

    return (
      <MotionComponent
        ref={ref}
        className={classes}
        initial={animation.initial}
        animate={animation.animate}
        transition={animation.transition}
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

  return (
    <Component ref={ref} className={classes} id={id} role={role} aria-label={ariaLabel} {...props}>
      {children}
    </Component>
  );
});

Container.displayName = 'Container';

/**
 * Reusable section wrapper.
 * Controls vertical section spacing and background styling.
 */
export function Section({
  children,
  className = '',
  background = 'default',
  spacing = 'lg',
  ...props
}) {
  const backgrounds = {
    default: '',
    muted: 'bg-gray-50/50 dark:bg-gray-900/50',
    accent: 'bg-[#45A9A9]/5 dark:bg-[#45A9A9]/10',
    gradient: 'bg-gradient-to-b from-transparent via-[#45A9A9]/5 to-transparent',
    dark: 'bg-gray-900 dark:bg-black',
  };

  const spacingMap = {
    none: 'py-0',
    sm: 'py-8 sm:py-10 lg:py-12',
    md: 'py-10 sm:py-12 lg:py-16',
    lg: 'py-12 sm:py-16 lg:py-20',
    xl: 'py-16 sm:py-20 lg:py-24',
  };

  return (
    <section
      className={cn(
        'relative w-full min-w-0',
        spacingMap[spacing] || spacingMap.lg,
        backgrounds[background],
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

/**
 * Responsive grid layout.
 */
export function Grid({ children, className = '', cols = 3, gap = 'md', ...props }) {
  return (
    <div
      className={cn(
        'grid w-full min-w-0',
        GRID_COLS[cols] || GRID_COLS[3],
        GAPS[gap] || GAPS.md,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Flexible row or column layout.
 */
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
  return (
    <div
      className={cn(
        'flex min-w-0',
        FLEX_DIRECTION[direction] || FLEX_DIRECTION.row,
        ALIGN[align] || ALIGN.center,
        JUSTIFY[justify] || JUSTIFY.between,
        wrap && 'flex-wrap',
        FLEX_GAPS[gap] || FLEX_GAPS.md,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Container;
