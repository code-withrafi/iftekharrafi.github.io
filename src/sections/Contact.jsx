import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiMail,
  FiHeart,
  FiArrowUpRight,
  FiCoffee,
  FiMessageCircle,
  FiYoutube,
} from 'react-icons/fi';
import SectionTitle from '@/components/common/SectionTitle';
import { socials } from '@/constants/socials';

// Social icons mapping
const socialIcons = {
  GitHub: FiGithub,
  LinkedIn: FiLinkedin,
  Twitter: FiTwitter,
  Email: FiMail,
  Youtube: FiYoutube,
};

// Social link card
function SocialLinkCard({ name, url, icon: Icon, index = 0, username = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.a
      ref={ref}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative"
    >
      {/* Hover glow */}
      <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-[#45A9A9]/10 to-[#98E8DE]/10 opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-sm transition-all duration-500 group-hover:border-[#45A9A9]/20 group-hover:bg-white/[0.04]">
        {/* Icon */}
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#45A9A9]/20 to-[#98E8DE]/20 transition-all duration-500 group-hover:scale-110 group-hover:from-[#45A9A9]/30 group-hover:to-[#98E8DE]/30">
          <Icon className="h-6 w-6 text-[#45A9A9]" />
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-white transition-colors duration-300 group-hover:text-[#45A9A9]">
            {name}
          </p>
          <p className="truncate text-sm text-white/40">
            {username || url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
          </p>
        </div>

        {/* Arrow */}
        <FiArrowUpRight className="h-5 w-5 flex-shrink-0 text-white/20 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#45A9A9]" />
      </div>
    </motion.a>
  );
}

// Decorative background
function BackgroundDecoration() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Large circle */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-40 -right-40 h-96 w-96 rounded-full border border-[#45A9A9]/5"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full border border-[#98E8DE]/5"
      />

      {/* Dots pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'radial-gradient(circle, #45A9A9 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />
    </div>
  );
}

// Availability badge
function AvailabilityBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="mb-8 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
      </span>
      <span className="text-sm font-medium text-green-400">Available for opportunities</span>
    </motion.div>
  );
}

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden py-24 sm:py-32">
      {/* Background decoration */}
      <BackgroundDecoration />

      <div className="relative z-10 mx-auto max-w-3xl px-6 sm:px-8 lg:px-12">
        {/* Section Title */}
        <div className="text-center">
          <AvailabilityBadge />
        </div>

        <SectionTitle
          subtitle="Contact"
          title="Let's Connect"
          description="I'm always open to discussing new projects, creative ideas, or opportunities."
          align="center"
          variant="brackets"
        />

        {/* Collaboration message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="relative mx-auto max-w-2xl rounded-3xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-sm sm:p-10">
            {/* Quote icon */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#45A9A9]/20 to-[#98E8DE]/20">
                <FiMessageCircle className="h-7 w-7 text-[#45A9A9]" />
              </div>
            </div>

            <p className="text-lg leading-relaxed text-white/70 sm:text-xl">
              Got a project in mind?{' '}
              <span className="text-[#45A9A9]">Let's create something amazing together.</span> Feel
              free to reach out through any of the platforms below.
            </p>

            <div className="mt-6 flex items-center justify-center gap-2 text-white/30">
              <span className="h-px w-6 bg-white/10" />
              <FiCoffee className="h-4 w-4 text-[#45A9A9]" />
              <span className="h-px w-6 bg-white/10" />
            </div>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-10"
        >
          <p className="mb-6 text-center text-sm tracking-widest text-white/30 uppercase">
            Find me on
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {socials.map((social, index) => {
              const Icon = socialIcons[social.name] || FiMail;
              return (
                <SocialLinkCard
                  key={social.name}
                  name={social.name}
                  url={social.url}
                  icon={Icon}
                  index={index}
                  username={social.username}
                />
              );
            })}
          </div>
        </motion.div>

        {/* Bottom message */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="flex items-center justify-center gap-3 text-white/20">
            <span className="h-px w-8 bg-white/10" />
            <FiHeart className="h-4 w-4 text-[#45A9A9]" />
            <span className="h-px w-8 bg-white/10" />
          </div>
          <p className="mt-4 text-sm text-white/30">Thank you for visiting my portfolio ✨</p>
        </motion.div>
      </div>
    </section>
  );
}
