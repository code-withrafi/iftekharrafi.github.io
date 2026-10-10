import { useRef, useState } from 'react';

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
  FiSend,
  FiCheckCircle,
  FiAlertCircle,
  FiMessageSquare,
} from 'react-icons/fi';

import SectionTitle from '@/components/common/SectionTitle';
import { socials } from '@/constants/socials';

// =====================================================
// CONFIGURATION
// =====================================================

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xppzdwgw';

// =====================================================
// SOCIAL ICONS
// =====================================================

const socialIcons = {
  GitHub: FiGithub,
  LinkedIn: FiLinkedin,
  Twitter: FiTwitter,
  Email: FiMail,
  Youtube: FiYoutube,
};

// =====================================================
// SOCIAL LINK CARD
// =====================================================

function SocialLinkCard({ name, url, icon: Icon, index = 0, username = '' }) {
  const ref = useRef(null);

  const isInView = useInView(ref, {
    once: true,
    margin: '-50px',
  });

  const displayUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');

  return (
    <motion.a
      ref={ref}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: index * 0.15,
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative"
    >
      {/* Hover glow */}
      <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-[#45A9A9]/10 to-[#98E8DE]/10 opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-100" />

      {/* Card */}
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

          <p className="truncate text-sm text-white/40">{username || displayUrl}</p>
        </div>

        {/* Arrow */}
        <FiArrowUpRight className="h-5 w-5 flex-shrink-0 text-white/20 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#45A9A9]" />
      </div>
    </motion.a>
  );
}

// =====================================================
// DECORATIVE BACKGROUND
// =====================================================

function BackgroundDecoration() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Large circle */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute -top-40 -right-40 h-96 w-96 rounded-full border border-[#45A9A9]/5"
      />

      <motion.div
        animate={{ rotate: -360 }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: 'linear',
        }}
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

// =====================================================
// AVAILABILITY BADGE
// =====================================================

function AvailabilityBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        type: 'spring',
      }}
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

// =====================================================
// INQUIRY FORM
// =====================================================

function InquiryForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // ===================================================
  // HANDLE INPUT CHANGE
  // ===================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (status === 'error') {
      setStatus('idle');
      setErrorMessage('');
    }
  };

  // ===================================================
  // HANDLE FORM SUBMIT
  // ===================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (status === 'submitting') {
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },

        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');

        setFormData({
          name: '',
          email: '',
          message: '',
        });

        return;
      }

      if (data?.errors?.length) {
        setErrorMessage(data.errors.map((error) => error.message).join(', '));
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }

      setStatus('error');
    } catch (error) {
      console.error('Form submission error:', error);

      setErrorMessage('Unable to send your inquiry. Please check your connection and try again.');

      setStatus('error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: 0.4,
        duration: 0.6,
      }}
      className="h-full"
    >
      <div className="relative h-full overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm sm:p-8">
        {/* Form glow */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-64 w-64 rounded-full bg-[#45A9A9]/5 blur-3xl" />

        <div className="relative z-10">
          {/* Form Header */}
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#45A9A9]/20 to-[#98E8DE]/20">
                <FiMessageSquare className="h-5 w-5 text-[#45A9A9]" />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white">For Inquiry</h3>

                <p className="mt-1 text-sm text-white/40">Have a project or idea? Let's talk.</p>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-start gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 p-4"
            >
              <FiCheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />

              <div>
                <p className="font-medium text-green-400">Inquiry sent successfully!</p>

                <p className="mt-1 text-sm text-green-400/70">
                  Thanks for reaching out. I'll get back to you soon.
                </p>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4"
            >
              <FiAlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />

              <div>
                <p className="font-medium text-red-400">Unable to send inquiry</p>

                <p className="mt-1 text-sm text-red-400/70">{errorMessage}</p>
              </div>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="inquiry-name"
                className="mb-2 block text-sm font-medium text-white/70"
              >
                Name
              </label>

              <input
                id="inquiry-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                autoComplete="name"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white transition-all duration-300 outline-none placeholder:text-white/20 focus:border-[#45A9A9]/40 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#45A9A9]/10"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="inquiry-email"
                className="mb-2 block text-sm font-medium text-white/70"
              >
                Email
              </label>

              <input
                id="inquiry-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white transition-all duration-300 outline-none placeholder:text-white/20 focus:border-[#45A9A9]/40 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#45A9A9]/10"
              />
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="inquiry-message"
                className="mb-2 block text-sm font-medium text-white/70"
              >
                Your message
              </label>

              <textarea
                id="inquiry-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your inquiry..."
                required
                rows={6}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm leading-relaxed text-white transition-all duration-300 outline-none placeholder:text-white/20 focus:border-[#45A9A9]/40 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#45A9A9]/10"
              />
            </div>

            {/* Send Inquiry Button */}
            <div className="pt-2">
              <motion.button
                type="submit"
                disabled={status === 'submitting'}
                whileHover={
                  status !== 'submitting'
                    ? {
                        y: -2,
                      }
                    : {}
                }
                whileTap={
                  status !== 'submitting'
                    ? {
                        scale: 0.98,
                      }
                    : {}
                }
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#45A9A9] to-[#98E8DE] px-5 py-3.5 text-sm font-semibold text-[#071313] transition-all duration-300 outline-none hover:shadow-lg hover:shadow-[#45A9A9]/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {status === 'submitting' ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#071313]/30 border-t-[#071313]" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                      Send Inquiry
                    </>
                  )}
                </span>
              </motion.button>
            </div>
          </form>

          {/* Privacy / helper text */}
          <p className="mt-5 text-center text-xs leading-relaxed text-white/20">
            Your information is only used to respond to your inquiry.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// =====================================================
// CONTACT SECTION
// =====================================================

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden py-24 sm:py-32">
      {/* Background decoration */}
      <BackgroundDecoration />

      <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        {/* =================================================
            AVAILABILITY
        ================================================= */}

        <div className="text-center">
          <AvailabilityBadge />
        </div>

        {/* =================================================
            SECTION TITLE
        ================================================= */}

        <SectionTitle
          subtitle="Contact"
          title="Let's Connect"
          description="I'm always open to discussing new projects, creative ideas, or opportunities."
          align="center"
          variant="brackets"
        />

        {/* =================================================
            COLLABORATION MESSAGE
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: 0.3,
            duration: 0.6,
          }}
          className="mt-12 text-center"
        >
          <div className="relative mx-auto max-w-3xl rounded-3xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-sm sm:p-10">
            {/* Quote icon */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#45A9A9]/20 to-[#98E8DE]/20">
                <FiMessageCircle className="h-7 w-7 text-[#45A9A9]" />
              </div>
            </div>

            <p className="text-lg leading-relaxed text-white/70 sm:text-xl">
              Got a project in mind?{' '}
              <span className="text-[#45A9A9]">Let's create something amazing together.</span> Feel
              free to reach out through the form or any of the platforms below.
            </p>

            <div className="mt-6 flex items-center justify-center gap-2 text-white/30">
              <span className="h-px w-6 bg-white/10" />

              <FiCoffee className="h-4 w-4 text-[#45A9A9]" />

              <span className="h-px w-6 bg-white/10" />
            </div>
          </div>
        </motion.div>

        {/* =================================================
            CONTACT GRID
        ================================================= */}

        <div className="mt-12 grid items-start gap-8 lg:grid-cols-2 lg:gap-10">
          {/* =================================================
              LEFT - SOCIAL LINKS
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              x: -30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: 0.4,
              duration: 0.6,
            }}
            className="lg:-translate-x- -20"
          >
            {/* Heading */}
            <div className="mb-6">
              <p className="text-sm font-medium tracking-widest text-[#45A9A9] uppercase">
                Connect
              </p>

              <h3 className="mt-2 text-2xl font-semibold text-white">Find me on</h3>

              <p className="mt-2 text-sm leading-relaxed text-white/40">
                You can also reach me through any of these platforms.
              </p>
            </div>

            {/* Social Links */}
            <div className="grid gap-4">
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

          {/* =================================================
              RIGHT - INQUIRY FORM
          ================================================= */}

          <div className="lg:translate-x-75">
            <InquiryForm />
          </div>
        </div>

        {/* =================================================
            BOTTOM MESSAGE
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: 0.8,
            duration: 0.6,
          }}
          className="mt-16 text-center"
        >
          <div className="flex items-center justify-center gap-3 text-white/20">
            <span className="h-px w-8 bg-white/10" />

            <FiHeart className="h-4 w-4 text-[#45A9A9]" />

            <span className="h-px w-8 bg-white/10" />
          </div>

          <p className="mt-4 text-sm text-white/30">Thank you for visiting my portfolio </p>
        </motion.div>
      </div>
    </section>
  );
}
