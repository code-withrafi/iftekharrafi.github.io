import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  FiBriefcase,
  FiBookOpen,
  FiMapPin,
  FiCalendar,
  FiAward,
  FiExternalLink,
  FiChevronDown,
  FiCheckCircle,
  FiStar,
} from 'react-icons/fi';

// Icon mapping outside component
const ITEM_ICONS = {
  education: FiBookOpen,
  achievement: FiAward,
  experience: FiBriefcase,
  default: FiBriefcase,
};

export default function TimelineItem({
  item,
  index = 0,
  animated = true,
  expanded = false,
  onToggle,
}) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [isHovered, setIsHovered] = useState(false);

  // Get the icon component reference (not a new component)
  const itemType = item.type || 'experience';
  const IconComponent = ITEM_ICONS[itemType] || ITEM_ICONS.default;

  // Get title based on item type
  const title = item.role || item.degree || item.title;
  const subtitle = item.company || item.institution || item.organization;
  const location = item.location;
  const duration = item.duration;
  const description = item.description;
  const highlights = item.highlights || [];
  const skills = item.skills || [];
  const link = item.link;
  const grade = item.grade || item.gpa;

  // Animation variants
  const cardVariants = {
    hidden: {
      opacity: 0,
      x: index % 2 === 0 ? -50 : 50,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: 'easeOut',
      },
    },
    hover: {
      scale: 1.02,
      y: -2,
      transition: {
        duration: 0.2,
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    onToggle?.(!isExpanded);
  };

  return (
    <motion.div
      variants={animated ? cardVariants : undefined}
      initial={animated ? 'hidden' : undefined}
      whileInView={animated ? 'visible' : undefined}
      viewport={animated ? { once: true, margin: '-50px' } : undefined}
      whileHover="hover"
      whileTap="tap"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      {/* Glow effect on hover */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-[#45A9A9]/20 to-[#98E8DE]/20 opacity-0 blur-xl transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : ''
        }`}
      />

      {/* Main card */}
      <div className="relative rounded-2xl border border-gray-200/50 bg-white/80 p-6 backdrop-blur-sm transition-all duration-300 hover:border-[#45A9A9]/30 hover:shadow-lg hover:shadow-[#45A9A9]/5 sm:p-8 dark:border-gray-700/50 dark:bg-gray-800/80 dark:hover:border-[#45A9A9]/40">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 h-20 w-20 overflow-hidden rounded-tr-2xl">
          <div className="absolute -top-10 -right-10 h-20 w-20 rotate-45 transform bg-gradient-to-br from-[#45A9A9]/20 to-[#98E8DE]/20 transition-transform duration-300 group-hover:scale-150" />
        </div>

        {/* Header section */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[#45A9A9]/20 bg-gradient-to-br from-[#45A9A9]/10 to-[#98E8DE]/10 sm:h-12 sm:w-12">
              <IconComponent className="h-5 w-5 text-[#45A9A9] sm:h-6 sm:w-6" />
            </div>

            {/* Title and subtitle */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 transition-colors duration-300 group-hover:text-[#45A9A9] sm:text-xl dark:text-white">
                {title}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-[#45A9A9] sm:text-base">{subtitle}</p>
                {location && (
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <FiMapPin className="h-3 w-3" />
                    {location}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Expand button */}
          {(description || highlights.length > 0) && (
            <button
              onClick={handleToggle}
              className="flex-shrink-0 rounded-lg p-2 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
            >
              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <FiChevronDown className="h-4 w-4 text-gray-400" />
              </motion.div>
            </button>
          )}
        </div>

        {/* Meta information */}
        <div className="mb-4 flex flex-wrap items-center gap-3 pl-14 sm:pl-16">
          {/* Duration */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#45A9A9]/10 px-3 py-1 text-xs font-medium text-[#45A9A9]">
            <FiCalendar className="h-3 w-3" />
            {duration}
          </span>

          {/* Grade/GPA */}
          {grade && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#98E8DE]/10 px-3 py-1 text-xs font-medium text-[#45A9A9]">
              <FiStar className="h-3 w-3" />
              {grade}
            </span>
          )}

          {/* Type badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
            <FiAward className="h-3 w-3" />
            {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
          </span>
        </div>

        {/* Expandable content */}
        <motion.div
          initial={false}
          animate={{
            height: isExpanded ? 'auto' : 0,
            opacity: isExpanded ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden pl-14 sm:pl-16"
        >
          <div className="space-y-4 pb-2">
            {/* Description */}
            {description && (
              <div className="text-sm leading-relaxed text-gray-600 sm:text-base dark:text-gray-300">
                {Array.isArray(description) ? (
                  description.map((desc, i) => (
                    <p key={i} className={i > 0 ? 'mt-2' : ''}>
                      {desc}
                    </p>
                  ))
                ) : (
                  <p>{description}</p>
                )}
              </div>
            )}

            {/* Highlights */}
            {highlights.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Key Highlights
                </h4>
                <ul className="space-y-2">
                  {highlights.map((highlight, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
                    >
                      <FiCheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#45A9A9]" />
                      <span>{highlight}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Skills & Technologies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="cursor-default rounded-full border border-[#45A9A9]/20 bg-gradient-to-r from-[#45A9A9]/10 to-[#98E8DE]/10 px-3 py-1 text-xs font-medium text-[#45A9A9] transition-colors duration-200 hover:bg-[#45A9A9]/20"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}

            {/* External link */}
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link inline-flex items-center gap-2 text-sm text-[#45A9A9] transition-colors duration-200 hover:text-[#98E8DE]"
              >
                <span>Learn more</span>
                <FiExternalLink className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
              </a>
            )}
          </div>
        </motion.div>

        {/* Timeline connector dot */}
        <div className="absolute top-8 -left-[9px] h-3 w-3 rounded-full border-2 border-white bg-[#45A9A9] shadow-lg shadow-[#45A9A9]/20 transition-transform duration-300 group-hover:scale-125 dark:border-gray-900" />
      </div>
    </motion.div>
  );
}
