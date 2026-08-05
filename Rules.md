# Development Rules

Project: Rafi Portfolio

Version: 1.0

Status: LOCKED

---

# 1. Purpose

This document defines mandatory development standards for the project.

Every file, component, animation, and feature must follow these rules.

No implementation may violate this document.

---

# 2. General Principles

Always prioritize:

- Readability
- Maintainability
- Performance
- Accessibility
- Reusability
- Simplicity

Never sacrifice code quality for shortcuts.

---

# 3. React Rules

✔ Functional components only.

✔ React Hooks only.

✔ No class components.

✔ Prefer composition over inheritance.

✔ One component = one responsibility.

✔ Keep components small.

✔ Avoid prop drilling where possible.

✔ Memoize expensive calculations.

---

# 4. Component Rules

Every component must:

- Have a single responsibility.
- Be reusable.
- Be self-contained.
- Avoid duplicated logic.

Shared UI belongs in:

components/ui/

Shared layout belongs in:

components/layout/

---

# 5. Folder Rules

Never place files in the wrong directory.

Example:

Hero component

✔ sections/Hero/

Button

✔ components/ui/

Navbar

✔ components/layout/

Three.js objects

✔ components/three/

---

# 6. Naming Conventions

Components

PascalCase

Example

HeroSection.jsx

Hooks

useSomething.js

Example

useScrollSpy.js

Constants

camelCase or UPPER_SNAKE_CASE for fixed values.

CSS Classes

Use Tailwind utilities first.

---

# 7. Styling Rules

Use Tailwind CSS as the primary styling solution.

Only create custom CSS for:

- Global styles
- Keyframes
- Utilities
- Scrollbar
- Selection
- Cursor

Avoid arbitrary inline styles unless necessary.

---

# 8. Animation Rules

Framer Motion

- Page transitions
- Text reveal
- Hover animations
- Scroll reveal
- Cards
- Buttons

Three.js

- Floating objects
- Camera motion
- Mouse interaction
- Particle movement

CSS

- Micro interactions
- Utility transitions

Avoid animation overload.

Animations must enhance UX, not distract.

---

# 9. Three.js Rules

Keep scenes lightweight.

Maximum one primary interactive scene.

Reuse materials where possible.

Dispose geometries correctly.

Lazy-load the Canvas.

Target 60 FPS on mid-range devices.

---

# 10. Performance Rules

- Lazy-load heavy components.
- Compress assets.
- Optimize images.
- Memoize expensive renders.
- Avoid unnecessary re-renders.
- Use React.lazy for Three.js.

Performance is a first-class requirement.

---

# 11. Accessibility Rules

- Semantic HTML.
- Keyboard navigation.
- Focus indicators.
- aria-labels where needed.
- Decorative visuals should not block usability.

---

# 12. Responsive Rules

Design mobile-first.

Support:

- Mobile
- Tablet
- Laptop
- Desktop
- Ultra-wide

No horizontal scrolling.

---

# 13. Git Rules

Recommended branch strategy:

main

feature/<feature-name>

Commit message format:

feat:
fix:
refactor:
style:
docs:
perf:
chore:

---

# 14. Code Quality

- No unused imports.
- No dead code.
- No console.log in production.
- ESLint clean.
- Consistent formatting.
- Prefer descriptive variable names.

---

# 15. Asset Rules

Images

WebP preferred.

Models

Optimize before importing.

Icons

Use React Icons.

Fonts

Limit to one or two font families.

---

# 16. Security

No API keys committed.

No secrets in the repository.

Use .env only if required in future versions.

---

# 17. Documentation

Every major folder should contain a README if it becomes complex.

Complex Three.js logic should include concise comments explaining the intent.

---

# 18. Completion Checklist

Before any feature is marked complete:

✓ Responsive

✓ Accessible

✓ Animated appropriately

✓ No console errors

✓ ESLint clean

✓ Performance checked

✓ Matches design system

✓ Reusable implementation

---

# END OF RULES
