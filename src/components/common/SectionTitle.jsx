import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// Animated line that draws itself
function AnimatedLine({ delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className={`h-px origin-left bg-gradient-to-r from-[#45A9A9] to-transparent ${className}`}
    />
  );
}

// Animated character reveal for title
function AnimatedTitle({ text, delay = 0 }) {
  const chars = text.split('');

  return (
    <span>
      {chars.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 40, rotateX: -90 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: delay + index * 0.03,
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

// Decorative bracket
function DecorativeBracket({ position = 'left', delay = 0 }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4, type: 'spring' }}
      className={`text-4xl font-thin text-[#45A9A9]/30 sm:text-5xl ${
        position === 'right' ? 'ml-2' : 'mr-2'
      }`}
    >
      {position === 'left' ? '[' : ']'}
    </motion.span>
  );
}

export default function SectionTitle({
  subtitle,
  title,
  description,
  align = 'center',
  variant = 'default', // 'default' | 'brackets' | 'line' | 'minimal'
  size = 'lg',
  className = '',
  titleDelay = 0.3,
  subtitleDelay = 0.1,
  descriptionDelay = 0.6,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  // Size classes
  const titleSizes = {
    sm: 'text-3xl sm:text-4xl',
    md: 'text-4xl sm:text-5xl',
    lg: 'text-5xl sm:text-6xl md:text-7xl',
    xl: 'text-6xl sm:text-7xl md:text-8xl',
  };

  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <motion.div
      ref={ref}
      className={`mb-16 flex flex-col gap-4 sm:mb-20 ${alignmentClasses[align]} ${className}`}
    >
      {/* Subtitle row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: subtitleDelay, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex items-center gap-4"
      >
        {/* Decorative line before subtitle */}
        <AnimatedLine delay={subtitleDelay} className="w-8 sm:w-12" />

        {/* Subtitle text */}
        <span className="text-sm font-medium tracking-[0.3em] text-[#45A9A9] uppercase sm:text-base">
          {subtitle}
        </span>

        {/* Decorative line after subtitle */}
        <AnimatedLine delay={subtitleDelay + 0.2} className="w-8 sm:w-12" />
      </motion.div>

      {/* Title */}
      <div className={`flex items-center ${align === 'center' ? 'justify-center' : ''}`}>
        {variant === 'brackets' && <DecorativeBracket position="left" delay={titleDelay} />}

        <h2 className={`${titleSizes[size]} leading-[1.1] font-black tracking-tight text-white`}>
          {variant === 'minimal' ? (
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: titleDelay, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {title}
            </motion.span>
          ) : (
            <AnimatedTitle text={title} delay={titleDelay} />
          )}
        </h2>

        {variant === 'brackets' && <DecorativeBracket position="right" delay={titleDelay + 0.4} />}
      </div>

      {/* Gradient underline */}
      {variant === 'line' && (
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: titleDelay + 0.5, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className={`h-1 rounded-full bg-gradient-to-r from-[#45A9A9] to-[#98E8DE] ${
            align === 'center' ? 'mx-auto' : ''
          }`}
          style={{ width: '80px' }}
        />
      )}

      {/* Description */}
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: descriptionDelay, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className={`max-w-2xl text-base leading-relaxed text-white/50 sm:text-lg ${
            align === 'center' ? 'mx-auto text-center' : ''
          }`}
        >
          {description}
        </motion.p>
      )}

      {/* Decorative dots */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: descriptionDelay + 0.3, duration: 0.5 }}
        className={`flex gap-1.5 ${align === 'center' ? 'justify-center' : ''}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#45A9A9]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#45A9A9]/60" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#45A9A9]/30" />
      </motion.div>
    </motion.div>
  );
}

// Specialized section title variants for quick use
export function BracketsTitle(props) {
  return <SectionTitle variant="brackets" {...props} />;
}

export function LineTitle(props) {
  return <SectionTitle variant="line" {...props} />;
}

export function MinimalTitle(props) {
  return <SectionTitle variant="minimal" {...props} />;
}

// Section counter (e.g., "01.", "02.")
export function NumberedTitle({ number, subtitle, title, description, ...props }) {
  return (
    <SectionTitle
      subtitle={
        <span className="flex items-center gap-3">
          <span className="text-2xl font-bold text-[#45A9A9] sm:text-3xl">
            {String(number).padStart(2, '0')}.
          </span>
          {subtitle}
        </span>
      }
      title={title}
      description={description}
      {...props}
    />
  );
}

// Centered section title with decorative elements
export function CenteredTitle({ subtitle, title, description }) {
  return (
    <div className="relative mb-16 text-center sm:mb-20">
      {/* Decorative background text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 0.03, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] font-black whitespace-nowrap text-white select-none sm:text-[160px]"
      >
        {subtitle}
      </motion.div>

      <div className="relative z-10">
        <SectionTitle subtitle={subtitle} title={title} description={description} align="center" />
      </div>
    </div>
  );
}
