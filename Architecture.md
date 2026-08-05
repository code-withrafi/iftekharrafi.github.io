# Architecture Document

Project: Rafi Portfolio

Version: 1.0

Status: Locked

---

# 1. Architecture Goals

The architecture is designed to be:

- Modular
- Scalable
- Maintainable
- Reusable
- Production-ready
- Easy to extend without refactoring

Every feature should fit into the existing structure rather than requiring structural changes.

---

# 2. Architectural Principles

- Component-driven development
- Single Responsibility Principle (SRP)
- Separation of Concerns
- Reusable UI components
- Lazy loading where appropriate
- Composition over inheritance
- Mobile-first design
- Performance-first rendering

---

# 3. High-Level Structure

src/
├── assets/
├── components/
│ ├── common/
│ ├── ui/
│ ├── layout/
│ └── three/
├── sections/
├── hooks/
├── constants/
├── data/
├── layouts/
├── styles/
├── utils/
├── App.jsx
└── main.jsx

---

# 4. Folder Responsibilities

assets/

- Images
- Icons
- Models
- Fonts
- Resume PDF

components/common/

- Button
- SectionTitle
- Loader
- SocialIcons

components/ui/

- GlassCard
- SkillCard
- ProjectCard
- TimelineItem
- Badge

components/layout/

- Navbar
- Footer
- Container

components/three/

- CanvasScene
- FloatingSphere
- Particles
- Lights
- CameraRig

sections/

- Hero
- About
- Skills
- Projects
- Experience
- Contact

hooks/

- useScrollSpy
- useMousePosition
- useWindowSize
- useScrollReveal

constants/

- Navigation
- Skills
- Projects
- SocialLinks

data/

- Portfolio data
- Timeline data
- Experience
- Education

layouts/

- MainLayout

styles/

- globals.css
- animations.css
- utilities.css

utils/

- animation.js
- helpers.js

---

# 5. Component Hierarchy

App
└── MainLayout
├── Loader
├── Navbar
├── Hero
│ └── ThreeScene
├── About
├── Skills
├── Projects
├── Experience
├── Contact
└── Footer

---

# 6. State Management

React hooks only.

Global state is intentionally avoided unless required.

Use:

- useState
- useEffect
- useMemo
- useCallback
- useRef

No Redux or Context unless a future feature genuinely requires it.

---

# 7. Three.js Architecture

Canvas
├── Camera
├── Environment
├── Lights
├── Floating Object
├── Particles
└── Mouse Interaction

Guidelines:

- Separate visual objects into independent components.
- Keep scene lightweight.
- Use lazy loading for the Canvas.
- Optimize geometry and materials.

---

# 8. Animation Strategy

Framer Motion handles:

- Text reveals
- Section transitions
- Hover effects
- Page load animations
- Scroll reveals

Three.js handles:

- 3D object motion
- Floating effects
- Mouse interaction
- Camera movement

CSS handles:

- Simple transitions
- Utility animations

---

# 9. Data Flow

Static data → constants/data → UI components → Sections → App

No API calls.

No backend.

No database.

---

# 10. Routing Strategy

Single-page application.

Navigation uses smooth scrolling with section IDs.

No React Router in v1.

---

# 11. Performance Strategy

- Lazy-load Three.js scene.
- Memoize expensive components.
- Minimize re-renders.
- Optimize images and models.
- Keep bundle size small.

---

# 12. Accessibility

- Semantic HTML
- Keyboard-accessible navigation
- Proper aria labels
- Sufficient color contrast
- Focus states

---

# 13. Error Handling

- Graceful fallback for Three.js loading.
- Asset fallback images.
- Error boundaries for heavy components (future enhancement).

---

# 14. Naming Conventions

Components:
PascalCase

Hooks:
useSomething

Constants:
UPPER_SNAKE_CASE where appropriate

Files:
Match exported component names.

---

# 15. Code Organization Rules

- One component per file.
- One responsibility per component.
- Avoid deeply nested components.
- Keep sections independent.
- Shared UI belongs in components/ui.

---

# 16. Scalability

Future additions should integrate without restructuring:

- Blog
- CMS
- Theme switcher
- Localization
- AI assistant
- Analytics
- Backend contact service

---

# END OF ARCHITECTURE
