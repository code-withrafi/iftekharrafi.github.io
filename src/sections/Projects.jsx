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

// Lazy image imports: Vite resolves these paths at build time.
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

  'anpr.png': () => import('@/assets/images/projects/anpr.png'),
  'anpr2.png': () => import('@/assets/images/projects/anpr2.png'),
  'anpr3.png': () => import('@/assets/images/projects/anpr3.png'),
  'anpr4.png': () => import('@/assets/images/projects/anpr4.png'),

  'disease_prediction_model_comparison.png': () =>
    import('@/assets/images/projects/disease_prediction_model_comparison.png'),
  'disease_prediction_threshold_analysis.png': () =>
    import('@/assets/images/projects/disease_prediction_threshold_analysis.png'),

  'handwriting_loss_curve.png': () => import('@/assets/images/projects/handwriting_loss_curve.png'),
  'handwriting_accuracy_curve.png': () =>
    import('@/assets/images/projects/handwriting_accuracy_curve.png'),
  'category_pass_rates.png': () => import('@/assets/images/projects/category_pass_rates.png'),

  'landing.png': () => import('@/assets/images/projects/landing.png'),
  'Flightresult.png': () => import('@/assets/images/projects/Flightresult.png'),
  '3flightdetails.png': () => import('@/assets/images/projects/3flightdetails.png'),
  '4seatselection.png': () => import('@/assets/images/projects/4seatselection.png'),
  '5mockpayment.png': () => import('@/assets/images/projects/5mockpayment.png'),
  '6confirmation.png': () => import('@/assets/images/projects/6confirmation.png'),
  '7bookingdetails.png': () => import('@/assets/images/projects/7bookingdetails.png'),
};

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

// Use the image filenames defined in the project data.
function getProjectImages(project) {
  if (!Array.isArray(project?.images)) {
    return [];
  }

  return project.images.filter(
    (imageName) => typeof imageName === 'string' && imageName.trim().length > 0,
  );
}

// Project image carousel
function ProjectImageCarousel({ images, projectTitle }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [loadedImages, setLoadedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const imageKey = useMemo(() => images.join('|'), [images]);

  useEffect(() => {
    let cancelled = false;

    async function loadImages() {
      setIsLoading(true);
      setLoadError(false);
      setLoadedImages([]);
      setCurrentImage(0);

      if (!images?.length) {
        setIsLoading(false);
        setLoadError(true);
        return;
      }

      const results = await Promise.all(
        images.map(async (imageName) => {
          const importer = imageImports[imageName];

          if (!importer) {
            console.error(`No image import registered for "${imageName}"`);
            return null;
          }

          try {
            const module = await importer();
            return module.default ?? null;
          } catch (error) {
            console.error(`Could not load "${imageName}" for "${projectTitle}"`, error);
            return null;
          }
        }),
      );

      if (cancelled) return;

      const validImages = results.filter(Boolean);

      setLoadedImages(validImages);
      setLoadError(validImages.length === 0);
      setIsLoading(false);
    }

    loadImages().catch((error) => {
      if (cancelled) return;

      console.error(`Image loading failed for "${projectTitle}"`, error);
      setLoadError(true);
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [imageKey, projectTitle, images]);

  useEffect(() => {
    if (currentImage >= loadedImages.length) {
      setCurrentImage(0);
    }
  }, [currentImage, loadedImages.length]);

  const nextImage = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (loadedImages.length > 1) {
        setCurrentImage((previous) => (previous + 1) % loadedImages.length);
      }
    },
    [loadedImages.length],
  );

  const prevImage = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (loadedImages.length > 1) {
        setCurrentImage((previous) => (previous - 1 + loadedImages.length) % loadedImages.length);
      }
    },
    [loadedImages.length],
  );

  if (loadError && !isLoading) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#45A9A9]/5 to-[#98E8DE]/5">
        <FiFolder className="h-12 w-12 text-[#45A9A9]/40" />
        <span className="text-xs text-white/40">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className="group/image relative h-full w-full overflow-hidden bg-gradient-to-br from-[#45A9A9]/5 to-[#98E8DE]/5">
      {isLoading && <div className="absolute inset-0 animate-pulse bg-white/5" />}

      {!isLoading && loadedImages.length > 0 && (
        <AnimatePresence mode="wait">
          <motion.img
            key={loadedImages[currentImage]}
            src={loadedImages[currentImage]}
            alt={`${projectTitle} screenshot ${currentImage + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full w-full object-cover object-top"
          />
        </AnimatePresence>
      )}

      {loadedImages.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevImage}
            aria-label="Previous image"
            className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white/70 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover/image:opacity-100 hover:bg-black/70 hover:text-white"
          >
            <FiChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={nextImage}
            aria-label="Next image"
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white/70 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover/image:opacity-100 hover:bg-black/70 hover:text-white"
          >
            <FiChevronRight className="h-4 w-4" />
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {loadedImages.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setCurrentImage(index);
                }}
                aria-label={`Go to image ${index + 1}`}
                className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                  index === currentImage ? 'w-4 bg-[#45A9A9]' : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Technology badge
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

// Featured project card
function FeaturedCard({ project, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const projectImageNames = useMemo(() => getProjectImages(project), [project]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative col-span-full"
    >
      <div className="relative grid items-center gap-8 rounded-3xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-300 group-hover:border-[#45A9A9]/20 sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-10">
        <div className="relative aspect-video overflow-hidden rounded-2xl">
          <ProjectImageCarousel images={projectImageNames} projectTitle={project.title} />
        </div>

        <div className="space-y-5">
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

          <h3 className="text-3xl font-bold text-white transition-colors duration-300 group-hover:text-[#45A9A9] sm:text-4xl">
            {project.title}
          </h3>

          <p className="leading-relaxed text-white/60">{project.description}</p>

          <div className="flex flex-wrap gap-2">
            {project.technologies?.map((tech, techIndex) => (
              <TechBadge key={tech} tech={tech} index={techIndex} />
            ))}
          </div>

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

// Standard project card
function ProjectCard({ project, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const projectImageNames = useMemo(() => getProjectImages(project), [project]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative"
    >
      <div className="relative h-full rounded-3xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#45A9A9]/20 sm:p-8">
        <div className="mb-5 aspect-video overflow-hidden rounded-2xl">
          <ProjectImageCarousel images={projectImageNames} projectTitle={project.title} />
        </div>

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
                aria-label={`View ${project.title} source code`}
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
                aria-label={`Open ${project.title} live demo`}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/40 transition-all duration-300 hover:border-[#45A9A9]/30 hover:text-[#45A9A9]"
              >
                <FiExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>

        <h3 className="mb-2 text-lg font-bold text-white transition-colors duration-300 group-hover:text-[#45A9A9] sm:text-xl">
          {project.title}
        </h3>

        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-white/50">
          {project.description}
        </p>

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

// Filter tabs
const FilterTabs = ({ categories, activeFilter, onFilterChange }) => (
  <div className="mb-10 flex flex-wrap justify-center gap-2">
    {categories.map((category) => (
      <button
        key={category}
        type="button"
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

  const allTech = useMemo(() => {
    const techSet = new Set();

    projects.forEach((project) => {
      project.technologies?.forEach((tech) => techSet.add(tech));
    });

    return ['All', ...Array.from(techSet)];
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') return projects;

    return projects.filter((project) => project.technologies?.includes(activeFilter));
  }, [activeFilter]);

  const featuredProject = filteredProjects[0];
  const remainingProjects = useMemo(() => filteredProjects.slice(1), [filteredProjects]);

  return (
    <section id="projects" className="relative overflow-hidden py-16 sm:py-20">
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <SectionTitle
          subtitle="Projects"
          title="Things I've Built"
          description="A selection of projects that showcase my skills and passion for development"
          align="center"
          variant="brackets"
        />

        <FilterTabs
          categories={allTech}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        <div className="space-y-6">
          {featuredProject && <FeaturedCard project={featuredProject} index={0} />}

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
            {remainingProjects.map((project, index) => (
              <ProjectCard key={project.id || project.title} project={project} index={index + 1} />
            ))}
          </div>
        </div>

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
