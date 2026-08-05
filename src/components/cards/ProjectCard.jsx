import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { FiGithub, FiExternalLink, FiFolder, FiStar, FiChevronRight, FiPlay } from 'react-icons/fi';

// Get tech color based on index (pure function)
function getTechColor(index) {
  const colors = [
    '#45A9A9',
    '#98E8DE',
    '#7B2FBE',
    '#FFD700',
    '#FF69B4',
    '#00FFFF',
    '#FF8C00',
    '#00FF88',
    '#FF4444',
    '#44FF44',
    '#4488FF',
    '#FF44FF',
  ];
  return colors[index % colors.length];
}

// Get tech background color (lighter version)
function getTechBgColor(index) {
  const color = getTechColor(index);
  return `${color}15`; // Add 15 for opacity
}

// Featured variant (large card with image area)
export function FeaturedProjectCard({ project, index = 0 }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.2, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      {/* Background glow */}
      <div
        className={`absolute -inset-4 rounded-3xl bg-gradient-to-r from-[#45A9A9]/20 to-[#98E8DE]/20 opacity-0 blur-2xl transition-opacity duration-700 ${
          isHovered ? 'opacity-100' : ''
        }`}
      />

      <div className="relative grid items-center gap-8 overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm transition-all duration-500 group-hover:border-[#45A9A9]/20 group-hover:bg-white/[0.04] lg:grid-cols-2 lg:gap-12">
        {/* Image Section */}
        <div className="relative aspect-video min-h-[300px] overflow-hidden lg:aspect-auto lg:h-full">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#45A9A9]/10 to-[#98E8DE]/10">
            <motion.div
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at center, #45A9A9 1px, transparent 1px)`,
                backgroundSize: '24px 24px',
              }}
            />
          </div>

          {/* Project image */}
          {project.image ? (
            <>
              <img
                src={project.image}
                alt={project.title}
                onLoad={() => setImageLoaded(true)}
                className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-110 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#45A9A9] border-t-transparent" />
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <FiFolder className="h-20 w-20 text-[#45A9A9]/20 transition-all duration-500 group-hover:scale-110 group-hover:text-[#45A9A9]/40" />
            </div>
          )}

          {/* Hover overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-[#06151D] via-[#06151D]/40 to-transparent p-8"
          >
            <div className="flex gap-3">
              <motion.a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-[#06151D] transition-all duration-300 hover:bg-[#45A9A9] hover:text-white"
              >
                <FiGithub className="h-4 w-4" />
                Source Code
              </motion.a>
              {project.live && (
                <motion.a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 rounded-full bg-[#45A9A9] px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-[#98E8DE]"
                >
                  <FiPlay className="h-4 w-4" />
                  Live Demo
                </motion.a>
              )}
            </div>
          </motion.div>

          {/* Featured badge */}
          <div className="absolute top-4 left-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.2 + 0.5, duration: 0.5 }}
              className="flex items-center gap-1.5 rounded-full border border-[#FFD700]/20 bg-[#FFD700]/10 px-3 py-1.5 backdrop-blur-sm"
            >
              <FiStar className="h-3 w-3 text-[#FFD700]" />
              <span className="text-xs font-medium text-[#FFD700]">Featured</span>
            </motion.div>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-6 p-6 sm:p-8 lg:p-10 lg:pl-0">
          {/* Title */}
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.2 + 0.4, duration: 0.5 }}
            className="text-3xl font-bold text-white transition-colors duration-300 group-hover:text-[#45A9A9] sm:text-4xl"
          >
            {project.title}
          </motion.h3>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.2 + 0.5, duration: 0.5 }}
            className="leading-relaxed text-white/60"
          >
            {project.description}
          </motion.p>

          {/* Highlights */}
          {project.highlights && (
            <motion.ul
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: index * 0.2 + 0.6, duration: 0.5 }}
              className="space-y-2"
            >
              {project.highlights.slice(0, 3).map((highlight, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/40">
                  <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-[#45A9A9]" />
                  {highlight}
                </li>
              ))}
            </motion.ul>
          )}

          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: index * 0.2 + 0.7, duration: 0.5 }}
            className="flex flex-wrap gap-2"
          >
            {project.technologies?.map((tech, techIndex) => (
              <motion.span
                key={tech}
                whileHover={{ scale: 1.05, y: -1 }}
                className="rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300"
                style={{
                  color: getTechColor(techIndex),
                  borderColor: `${getTechColor(techIndex)}40`,
                  backgroundColor: getTechBgColor(techIndex),
                }}
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.2 + 0.8, duration: 0.5 }}
            className="flex items-center gap-4 pt-2"
          >
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link flex items-center gap-2 text-sm text-white/40 transition-colors duration-300 hover:text-[#45A9A9]"
            >
              <FiGithub className="h-4 w-4" />
              <span>Source</span>
              <FiChevronRight className="h-3 w-3 transition-transform group-hover/link:translate-x-1" />
            </a>
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link flex items-center gap-2 text-sm text-white/40 transition-colors duration-300 hover:text-[#45A9A9]"
              >
                <FiExternalLink className="h-4 w-4" />
                <span>Live Demo</span>
                <FiChevronRight className="h-3 w-3 transition-transform group-hover/link:translate-x-1" />
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// Standard card variant
export default function ProjectCard({ project, index = 0 }) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative h-full"
    >
      {/* Card glow */}
      <div
        className={`absolute -inset-2 rounded-3xl bg-gradient-to-r from-[#45A9A9]/10 to-[#98E8DE]/10 opacity-0 blur-xl transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : ''
        }`}
      />

      <div className="relative flex h-full flex-col rounded-3xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-500 group-hover:-translate-y-2 group-hover:border-[#45A9A9]/20 group-hover:bg-white/[0.04] sm:p-8">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <motion.div
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#45A9A9]/20 to-[#98E8DE]/20 transition-all duration-500 group-hover:from-[#45A9A9]/30 group-hover:to-[#98E8DE]/30"
          >
            {project.icon ? (
              <project.icon className="h-6 w-6 text-[#45A9A9]" />
            ) : (
              <FiFolder className="h-6 w-6 text-[#45A9A9]" />
            )}
          </motion.div>

          <div className="flex gap-2">
            <motion.a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/40 transition-all duration-300 hover:border-[#45A9A9]/30 hover:bg-[#45A9A9]/10 hover:text-[#45A9A9]"
              aria-label="View source code"
            >
              <FiGithub className="h-4 w-4" />
            </motion.a>
            {project.live && (
              <motion.a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/40 transition-all duration-300 hover:border-[#45A9A9]/30 hover:bg-[#45A9A9]/10 hover:text-[#45A9A9]"
                aria-label="View live demo"
              >
                <FiExternalLink className="h-4 w-4" />
              </motion.a>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          <h3 className="text-xl font-bold text-white transition-colors duration-300 group-hover:text-[#45A9A9] sm:text-2xl">
            {project.title}
          </h3>

          <p className="line-clamp-3 text-sm leading-relaxed text-white/50 sm:text-base">
            {project.description}
          </p>

          {/* Highlights preview */}
          {project.highlights && (
            <ul className="space-y-1.5">
              {project.highlights.slice(0, 2).map((highlight, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-white/30">
                  <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-[#45A9A9]/50" />
                  {highlight}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 border-t border-white/5 pt-4">
          <div className="flex flex-wrap gap-2">
            {project.technologies?.slice(0, 4).map((tech, techIndex) => (
              <motion.span
                key={tech}
                whileHover={{ scale: 1.05 }}
                className="rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-300"
                style={{
                  color: getTechColor(techIndex),
                  backgroundColor: getTechBgColor(techIndex),
                }}
              >
                {tech}
              </motion.span>
            ))}
            {project.technologies?.length > 4 && (
              <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium text-white/30">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Corner decoration */}
        <div className="absolute top-0 right-0 h-20 w-20 overflow-hidden rounded-tr-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute -top-10 -right-10 h-20 w-20 rotate-45 transform bg-gradient-to-br from-[#45A9A9]/20 to-[#98E8DE]/20 transition-transform duration-500 group-hover:scale-150" />
        </div>
      </div>
    </motion.div>
  );
}

// Compact card variant (for sidebars or smaller spaces)
export function CompactProjectCard({ project, index = 0 }) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.a
      ref={ref}
      href={project.live || project.github}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all duration-300 hover:border-[#45A9A9]/20 hover:bg-white/[0.04]"
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#45A9A9]/20 to-[#98E8DE]/20 transition-all duration-300 group-hover:from-[#45A9A9]/30 group-hover:to-[#98E8DE]/30">
        <FiFolder className="h-5 w-5 text-[#45A9A9]" />
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="truncate font-medium text-white transition-colors duration-300 group-hover:text-[#45A9A9]">
          {project.title}
        </h4>
        <p className="truncate text-sm text-white/40">{project.description}</p>
      </div>

      <FiChevronRight className="h-4 w-4 flex-shrink-0 text-white/20 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#45A9A9]" />
    </motion.a>
  );
}
