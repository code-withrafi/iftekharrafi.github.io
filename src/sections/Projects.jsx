import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  FiGithub,
  FiExternalLink,
  FiFolder,
  FiStar,
  FiChevronRight,
  FiChevronLeft,
} from 'react-icons/fi';
import { projects } from '@/constants/projects';
import SectionTitle from '@/components/common/SectionTitle';

// Lazy load images only when needed
const imageImports = {
  'skycast.png': () => import('@/assets/images/projects/skycast.png'),
  'skycast2.png': () => import('@/assets/images/projects/skycast2.png'),
  'skycast3.png': () => import('@/assets/images/projects/skycast3.png'),
  'skycast4.png': () => import('@/assets/images/projects/skycast4.png'),
  'medha-ai.png': () => import('@/assets/images/projects/medha-ai.png'),
  'medha-ai2.png': () => import('@/assets/images/projects/medha-ai2.png'),
  'portfolio.png': () => import('@/assets/images/projects/portfolio.png'),
  'portfolio2.png': () => import('@/assets/images/projects/portfolio2.png'),
  'portfolio3.png': () => import('@/assets/images/projects/portfolio3.png'),
  'emotionvision.png': () => import('@/assets/images/projects/emotionvision.png'),
  'emotionvision2.png': () => import('@/assets/images/projects/emotionvision2.png'),
  'emotionvision3.png': () => import('@/assets/images/projects/emotionvision3.png'),
};

// Memoized tech color function
const techColors = [
  '#45A9A9',
  '#98E8DE',
  '#7B2FBE',
  '#FFD700',
  '#FF69B4',
  '#00FFFF',
  '#FF8C00',
  '#00FF88',
];

function getTechColor(index) {
  return techColors[index % techColors.length];
}

// Helper function to get project images based on title
function getProjectImages(title) {
  const titleLower = title.toLowerCase();

  if (titleLower.includes('skycast')) {
    return ['skycast.png', 'skycast2.png', 'skycast3.png', 'skycast4.png'];
  }
  if (titleLower.includes('medha')) {
    return ['medha-ai.png', 'medha-ai2.png'];
  }
  if (titleLower.includes('portfolio') || titleLower.includes('rafi')) {
    return ['portfolio.png', 'portfolio2.png', 'portfolio3.png'];
  }
  if (titleLower.includes('emotion')) {
    return ['emotionvision.png', 'emotionvision2.png', 'emotionvision3.png'];
  }

  // Default fallback
  return [];
}

// Optimized image carousel with lazy loading
function ProjectImageCarousel({ images, projectTitle }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [loadedImages, setLoadedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const carouselRef = useRef(null);
  const isInView = useInView(carouselRef, { once: true, margin: '200px' });

  // Load images only when carousel is about to be visible
  useEffect(() => {
    if (!isInView || !images || images.length === 0) return;

    const loadImages = async () => {
      try {
        const loaded = await Promise.all(
          images.map(async (imageName) => {
            if (imageImports[imageName]) {
              try {
                const module = await imageImports[imageName]();
                return module.default;
              } catch (err) {
                console.warn(`Failed to load image: ${imageName}`, err);
                return null;
              }
            }
            console.warn(`No import found for: ${imageName}`);
            return null;
          }),
        );
        const filtered = loaded.filter(Boolean);
        if (filtered.length === 0) {
          setLoadError(true);
        }
        setLoadedImages(filtered);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load images:', error);
        setLoadError(true);
        setIsLoading(false);
      }
    };

    loadImages();
  }, [isInView, images]);

  const nextImage = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setCurrentImage((prev) => (prev + 1) % loadedImages.length);
    },
    [loadedImages.length],
  );

  const prevImage = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setCurrentImage((prev) => (prev - 1 + loadedImages.length) % loadedImages.length);
    },
    [loadedImages.length],
  );

  // Show folder icon if no images or error
  if (!images || images.length === 0 || loadError || (loadedImages.length === 0 && !isLoading)) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#45A9A9]/5 to-[#98E8DE]/5">
        <FiFolder className="h-12 w-12 text-[#45A9A9]/20" />
      </div>
    );
  }

  return (
    <div
      ref={carouselRef}
      className="group/image relative h-full w-full overflow-hidden bg-gradient-to-br from-[#45A9A9]/5 to-[#98E8DE]/5"
    >
      {/* Loading skeleton */}
      {isLoading && <div className="absolute inset-0 animate-pulse bg-white/5" />}

      {/* Images */}
      {loadedImages.length > 0 && (
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImage}
            src={loadedImages[currentImage]}
            alt={`${projectTitle} screenshot ${currentImage + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full w-full object-cover object-top"
            loading="lazy"
          />
        </AnimatePresence>
      )}

      {/* Navigation arrows - only show if multiple images */}
      {loadedImages.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white/70 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover/image:opacity-100 hover:bg-black/70 hover:text-white"
            aria-label="Previous image"
          >
            <FiChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={nextImage}
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white/70 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover/image:opacity-100 hover:bg-black/70 hover:text-white"
            aria-label="Next image"
          >
            <FiChevronRight className="h-4 w-4" />
          </button>

          {/* Dots indicator */}
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {loadedImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentImage(index);
                }}
                className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                  index === currentImage ? 'w-4 bg-[#45A9A9]' : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Optimized Tech Badge
const TechBadge = ({ tech, index }) => (
  <span
    className="rounded-full border px-2.5 py-1 text-xs font-medium"
    style={{
      color: getTechColor(index),
      borderColor: `${getTechColor(index)}30`,
      backgroundColor: `${getTechColor(index)}10`,
    }}
  >
    {tech}
  </span>
);

// Featured project card - OPTIMIZED
function FeaturedCard({ project, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Get project images using helper function
  const projectImageNames = useMemo(() => getProjectImages(project.title), [project.title]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative col-span-full"
    >
      <div className="relative grid items-center gap-8 rounded-3xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-300 group-hover:border-[#45A9A9]/20 sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-10">
        {/* Project Image */}
        <div className="relative aspect-video overflow-hidden rounded-2xl">
          <ProjectImageCarousel images={projectImageNames} projectTitle={project.title} />
        </div>

        {/* Project Info */}
        <div className="space-y-5">
          {/* Featured badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: index * 0.15 + 0.2, duration: 0.4 }}
            className="flex items-center gap-2"
          >
            <FiStar className="h-4 w-4 text-[#FFD700]" />
            <span className="text-xs font-medium tracking-widest text-[#FFD700] uppercase">
              Featured Project
            </span>
          </motion.div>

          {/* Title */}
          <h3 className="text-3xl font-bold text-white transition-colors duration-300 group-hover:text-[#45A9A9] sm:text-4xl">
            {project.title}
          </h3>

          {/* Description */}
          <p className="leading-relaxed text-white/60">{project.description}</p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2">
            {project.technologies?.map((tech, techIndex) => (
              <TechBadge key={tech} tech={tech} index={techIndex} />
            ))}
          </div>

          {/* Links */}
          <div className="flex items-center gap-4 pt-2">
            {project.github && (
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
            )}
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
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Standard project card - OPTIMIZED
function ProjectCard({ project, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Get project images using helper function
  const projectImageNames = useMemo(() => getProjectImages(project.title), [project.title]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative"
    >
      <div className="relative h-full rounded-3xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#45A9A9]/20 sm:p-8">
        {/* Project Image */}
        <div className="mb-5 aspect-video overflow-hidden rounded-2xl">
          <ProjectImageCarousel images={projectImageNames} projectTitle={project.title} />
        </div>

        {/* Card header */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#45A9A9]/20 to-[#98E8DE]/20">
            <FiFolder className="h-5 w-5 text-[#45A9A9]" />
          </div>

          <div className="flex gap-2">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/40 transition-all duration-300 hover:border-[#45A9A9]/30 hover:text-[#45A9A9]"
              >
                <FiGithub className="h-3.5 w-3.5" />
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/40 transition-all duration-300 hover:border-[#45A9A9]/30 hover:text-[#45A9A9]"
              >
                <FiExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="mb-2 text-lg font-bold text-white transition-colors duration-300 group-hover:text-[#45A9A9] sm:text-xl">
          {project.title}
        </h3>

        {/* Description */}
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-white/50">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="mt-auto flex flex-wrap gap-1.5">
          {project.technologies?.slice(0, 3).map((tech, techIndex) => (
            <span
              key={tech}
              className="rounded-full px-2 py-0.5 text-xs font-medium"
              style={{
                color: getTechColor(techIndex),
                backgroundColor: `${getTechColor(techIndex)}10`,
              }}
            >
              {tech}
            </span>
          ))}
          {project.technologies?.length > 3 && (
            <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs font-medium text-white/40">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Filter tabs - OPTIMIZED
const FilterTabs = ({ categories, activeFilter, onFilterChange }) => (
  <div className="mb-10 flex flex-wrap justify-center gap-2">
    {categories.map((category) => (
      <button
        key={category}
        onClick={() => onFilterChange(category)}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
          activeFilter === category
            ? 'bg-[#45A9A9] text-white shadow-lg shadow-[#45A9A9]/25'
            : 'border border-white/5 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
        }`}
      >
        {category}
      </button>
    ))}
  </div>
);

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All');

  // Extract unique tech categories - MEMOIZED
  const allTech = useMemo(() => {
    const techSet = new Set();
    projects.forEach((project) => {
      project.technologies?.forEach((tech) => techSet.add(tech));
    });
    return ['All', ...Array.from(techSet)];
  }, []);

  // Filter projects - MEMOIZED
  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') return projects;
    return projects.filter((project) => project.technologies?.includes(activeFilter));
  }, [activeFilter]);

  // Separate featured project
  const featuredProject = filteredProjects[0];
  const remainingProjects = useMemo(() => filteredProjects.slice(1), [filteredProjects]);

  return (
    <section id="projects" className="relative overflow-hidden py-20 sm:py-28">
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Section Title */}
        <SectionTitle
          subtitle="Projects"
          title="Things I've Built"
          description="A selection of projects that showcase my skills and passion for development"
          align="center"
          variant="brackets"
        />

        {/* Filter Tabs */}
        <FilterTabs
          categories={allTech}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {/* Projects Display */}
        <div className="space-y-6">
          {/* Featured Project */}
          {featuredProject && <FeaturedCard project={featuredProject} index={0} />}

          {/* Remaining Projects Grid */}
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
            {remainingProjects.map((project, index) => (
              <ProjectCard key={project.id || project.title} project={project} index={index + 1} />
            ))}
          </div>
        </div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className="py-20 text-center">
            <FiFolder className="mx-auto mb-4 h-16 w-16 text-white/10" />
            <p className="text-lg text-white/40">No projects found with this technology.</p>
          </div>
        )}
      </div>
    </section>
  );
}
