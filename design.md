# Design System

Project: Rafi Portfolio

Version: 1.0

Status: LOCKED

---

# 1. Design Philosophy

The portfolio should feel like:

- Premium
- Modern
- Elegant
- Interactive
- Futuristic without excessive neon
- Minimal yet memorable

Inspired by high-quality developer portfolios and modern SaaS products.

---

# 2. Visual Identity

Keywords

- Premium
- Glassmorphism
- Soft gradients
- Floating UI
- Depth
- Motion
- Spacious layouts
- Clean typography

---

# 3. Theme Support

The application supports:

✔ Dark Mode

✔ Light Mode

Both themes must use the same design language.

---

# 4. Color Palette

## Dark Theme

### Primary Background

#1B3C53

### Secondary Background

#234C6A

### Surface

#456882

### Accent

#D2C1B6

### Card

#222831

### Elevated Card

#352F44

### Glass Layer

#5C5470

---

## Dark Theme Text

Primary

#F8FAFC

Secondary

#FFF7EB

Muted

#E0D9D9

Disabled

#D3DAD9

---

## Light Theme

Primary Background

#F8FAFC

Secondary Background

#F9F6E6

Surface

#D9EAFD

Accent

#8D77AB

Card

#BCCCDC

Elevated Card

#9AA6B2

---

## Light Theme Text

Primary

#03001C

Heading

#18122B

Body

#331D2C

Secondary

#27374D

Muted

#352F44

---

# 5. Gradient System

Dark

Primary

#1B3C53 → #234C6A

Secondary

#234C6A → #456882

Accent

#456882 → #D2C1B6

Hero Glow

#1B3C53 → #352F44

---

Light

Primary

#F8FAFC → #D9EAFD

Secondary

#D9EAFD → #BCCCDC

Accent

#BCCCDC → #8D77AB

---

# 6. Typography

Recommended Fonts

Headings

Space Grotesk

Body

Inter

Fallback

sans-serif

---

Heading Scale

Hero

64px

Section

42px

Card Title

24px

Body

18px

Small

14px

---

# 7. Border Radius

Buttons

16px

Cards

24px

Glass Cards

28px

Inputs

16px

Badges

999px

---

# 8. Shadows

Soft Shadow

Small blur for cards.

Glass Shadow

Medium blur with transparency.

Hero Glow

Large blurred radial glow behind the 3D object.

---

# 9. Glassmorphism

All glass cards should use:

- Semi-transparent background
- Backdrop blur
- Thin border
- Soft shadow

Avoid excessive transparency that hurts readability.

---

# 10. Spacing System

4px base unit

Common spacing:

4

8

12

16

24

32

48

64

96

128

---

# 11. Layout

Maximum content width

1280px

Container padding

Mobile

16px

Tablet

32px

Desktop

48px

Section spacing

120px

---

# 12. Responsive Breakpoints

Mobile

<640px

Tablet

640–1023px

Laptop

1024–1439px

Desktop

1440px+

Ultra-wide

1920px+

---

# 13. Buttons

Primary

Solid accent

Rounded

Hover lift

Secondary

Glass style

Outline

Animated border

Icon Button

Circular

Hover scale

---

# 14. Cards

Cards should have:

Rounded corners

Glass effect

Soft hover lift

Border glow

Smooth transitions

---

# 15. Motion System

Framer Motion

Fade

Slide

Scale

Stagger

Reveal

Hover lift

Duration

0.3s–0.8s

Ease

easeOut

spring for interactive elements

---

# 16. Three.js Design

Hero includes:

Floating abstract object

Soft bloom

Ambient lighting

Subtle mouse interaction

Floating animation

Optional particle field

Performance takes priority over visual complexity.

---

# 17. Icons

Use React Icons consistently.

Maintain uniform sizing and spacing.

---

# 18. Accessibility

Maintain WCAG-compliant contrast.

Do not rely solely on color to convey meaning.

Provide visible keyboard focus styles.

---

# 19. Design Consistency

Every section must:

- Share the same spacing rhythm.
- Use the same typography scale.
- Reuse button styles.
- Reuse card styles.
- Follow the defined color system.

No section should introduce a conflicting visual style.

---

# END OF DESIGN SYSTEM
