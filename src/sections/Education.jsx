import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import {
  FiBookOpen,
  FiAward,
  FiCalendar,
  FiMapPin,
  FiStar,
  FiChevronRight,
  FiDownload,
  FiExternalLink,
  FiBookmark,
  FiTrendingUp,
  FiUsers,
  FiClock,
} from 'react-icons/fi';
import { education } from '@/constants/education';
import SectionTitle from '@/components/common/SectionTitle';
import Button from '@/components/common/Button';

// Timeline line with scroll progress
function TimelineLine({ scrollYProgress }) {
  const height = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div className="absolute top-0 bottom-0 left-8 w-px bg-white/5 lg:left-1/2 lg:-translate-x-px">
      <motion.div
        style={{ height }}
        className="w-full bg-gradient-to-b from-[#45A9A9] to-[#98E8DE]"
      />
    </div>
  );
}

// Animated timeline dot
function TimelineDot({ isActive, delay = 0, icon: Icon }) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      whileInView={{ scale: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, type: 'spring' }}
      className={`absolute left-8 z-10 flex h-10 w-10 -translate-x-[19px] items-center justify-center rounded-full transition-all duration-500 lg:left-1/2 lg:-translate-x-5 ${
        isActive
          ? 'bg-gradient-to-br from-[#45A9A9] to-[#98E8DE] shadow-lg shadow-[#45A9A9]/50'
          : 'border-2 border-white/20 bg-[#06151D]'
      }`}
    >
      <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-white/40'}`} />

      {isActive && (
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 -z-10 rounded-full bg-[#45A9A9]"
        />
      )}
    </motion.div>
  );
}

// Education card
function EducationCard({ item, index, isLeft }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  // Calculate duration
  const duration =
    item.startDate && item.endDate ? `${item.startDate} - ${item.endDate}` : item.duration;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.2, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative flex items-start gap-8 lg:gap-0 ${
        isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'
      }`}
    >
      {/* Content */}
      <div className={`flex-1 ${isLeft ? 'lg:pr-16 lg:text-right' : 'lg:pl-16'}`}>
        <motion.div
          whileHover={{ y: -3 }}
          className={`relative rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-500 hover:border-[#45A9A9]/20 hover:bg-white/[0.04] sm:rounded-3xl sm:p-8 ${
            isLeft ? 'lg:ml-auto' : ''
          }`}
          style={{ maxWidth: 'calc(100% - 4rem)' }}
        >
          {/* Glow effect */}
          <div
            className={`absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#45A9A9]/10 to-[#98E8DE]/10 opacity-0 blur-xl transition-opacity duration-500 ${
              isHovered ? 'opacity-100' : ''
            }`}
          />

          <div className="relative">
            {/* Header */}
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: isHovered ? 360 : 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#45A9A9]/20 to-[#98E8DE]/20 transition-all duration-500 group-hover:from-[#45A9A9]/30 group-hover:to-[#98E8DE]/30 sm:h-12 sm:w-12"
                >
                  <FiBookOpen className="h-5 w-5 text-[#45A9A9] sm:h-6 sm:w-6" />
                </motion.div>

                <div>
                  <h3 className="text-lg font-bold text-white transition-colors duration-300 group-hover:text-[#45A9A9] sm:text-xl">
                    {item.degree || item.title}
                  </h3>
                  <p className="text-sm font-medium text-[#45A9A9] sm:text-base">
                    {item.institution || item.school}
                  </p>
                </div>
              </div>

              {/* Grade badge */}
              {item.grade && (
                <div className="flex items-center gap-1.5 rounded-full border border-[#FFD700]/20 bg-[#FFD700]/10 px-3 py-1.5 whitespace-nowrap">
                  <FiStar className="h-3 w-3 text-[#FFD700]" />
                  <span className="text-xs font-medium text-[#FFD700]">{item.grade}</span>
                </div>
              )}
            </div>

            {/* Meta info */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-sm text-white/40">
                <FiCalendar className="h-3.5 w-3.5" />
                <span>{duration}</span>
              </div>
              {item.location && (
                <div className="flex items-center gap-1.5 text-sm text-white/40">
                  <FiMapPin className="h-3.5 w-3.5" />
                  <span>{item.location}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {item.description && (
              <p className="mb-4 text-sm leading-relaxed text-white/60 sm:text-base">
                {item.description}
              </p>
            )}

            {/* Expandable details */}
            {(item.highlights || item.courses) && (
              <>
                <motion.button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mb-3 flex items-center gap-2 text-sm text-[#45A9A9] transition-colors duration-300 hover:text-[#98E8DE]"
                >
                  <span>{isExpanded ? 'Show less' : 'Show details'}</span>
                  <motion.span
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FiChevronRight className="h-4 w-4" />
                  </motion.span>
                </motion.button>

                <motion.div
                  initial={false}
                  animate={{
                    height: isExpanded ? 'auto' : 0,
                    opacity: isExpanded ? 1 : 0,
                  }}
                  transition={{ duration: 0.4 }}
                  className="overflow-hidden"
                >
                  {/* Achievements */}
                  {item.highlights && item.highlights.length > 0 && (
                    <div className="mb-4">
                      <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-white/80">
                        <FiAward className="h-4 w-4 text-[#45A9A9]" />
                        Achievements
                      </h4>
                      <ul className="space-y-2">
                        {item.highlights.map((highlight, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={isExpanded ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start gap-2 text-sm text-white/50"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#45A9A9]" />
                            {highlight}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Relevant Courses */}
                  {item.courses && item.courses.length > 0 && (
                    <div className="mb-4">
                      <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-white/80">
                        <FiBookmark className="h-4 w-4 text-[#45A9A9]" />
                        Relevant Courses
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {item.courses.map((course, i) => (
                          <span
                            key={course}
                            className="rounded-full border border-white/5 bg-white/5 px-2.5 py-1 text-xs font-medium text-white/40 transition-all duration-300 hover:border-[#45A9A9]/20 hover:text-[#45A9A9]"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </>
            )}

            {/* Activities */}
            {item.activities && (
              <div className="mt-4 flex flex-wrap gap-2 border-t border-white/5 pt-4">
                {item.activities.map((activity, i) => (
                  <span
                    key={activity}
                    className="rounded-full border border-[#45A9A9]/10 bg-[#45A9A9]/5 px-2.5 py-1 text-xs font-medium text-[#45A9A9]/70"
                  >
                    {activity}
                  </span>
                ))}
              </div>
            )}

            {/* School link */}
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm text-white/30 transition-colors duration-300 hover:text-[#45A9A9]"
              >
                <FiExternalLink className="h-3.5 w-3.5" />
                <span>Visit institution</span>
              </a>
            )}
          </div>
        </motion.div>
      </div>

      {/* Spacer for timeline */}
      <div className="hidden lg:block lg:w-1/2" />
    </motion.div>
  );
}

// Quick stats cards
function StatCard({ icon: Icon, label, value, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -3 }}
      className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-all duration-300 hover:border-[#45A9A9]/20"
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#45A9A9]/20 to-[#98E8DE]/20 transition-all duration-300 group-hover:from-[#45A9A9]/30 group-hover:to-[#98E8DE]/30">
          <Icon className="h-5 w-5 text-[#45A9A9]" />
        </div>
        <span className="text-2xl font-bold text-white transition-colors duration-300 group-hover:text-[#45A9A9]">
          {value}
        </span>
      </div>
      <p className="text-sm text-white/40">{label}</p>
    </motion.div>
  );
}

// Current education badge
function CurrentBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="relative mb-12 inline-flex items-center gap-2 rounded-full border border-[#45A9A9]/20 bg-[#45A9A9]/10 px-4 py-2"
    >
      <FiBookOpen className="h-4 w-4 text-[#45A9A9]" />
      <span className="text-sm font-medium text-[#45A9A9]">Academic Journey</span>
    </motion.div>
  );
}

export default function Education() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  return (
    <section id="education" className="relative overflow-hidden py-24 sm:py-32">
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Section Title */}
        <div className="text-center">
          <CurrentBadge />
        </div>

        <SectionTitle
          subtitle="Education"
          title="My Academic Background"
          description="My educational journey that shaped my knowledge and skills"
          align="center"
          variant="brackets"
        />

        {/* Timeline */}
        <div ref={containerRef} className="relative mt-8">
          {/* Timeline line */}
          <TimelineLine scrollYProgress={scrollYProgress} />

          {/* Education items */}
          <div className="space-y-12 lg:space-y-16">
            {education.map((item, index) => (
              <div key={index} className="relative">
                <TimelineDot
                  isActive={index === 0}
                  delay={index * 0.2 + 0.3}
                  icon={index === 0 ? FiStar : FiBookOpen}
                />
                <EducationCard item={item} index={index} isLeft={index % 2 === 0} />
              </div>
            ))}
          </div>

          {/* Timeline end marker */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="absolute bottom-0 left-8 z-10 h-3 w-3 -translate-x-[7px] rounded-full bg-gradient-to-r from-[#45A9A9] to-[#98E8DE] lg:left-1/2 lg:-translate-x-1.5"
          >
            <motion.div
              animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-[#45A9A9]"
            />
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="mb-6 text-white/40">Want to know more about my qualifications?</p>
          <Button variant="gradient" size="lg">
            <span className="flex items-center gap-2">
              <FiDownload className="h-5 w-5" />
              Download CV
            </span>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
