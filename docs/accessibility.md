# Agenseek - Accessibility Statement

**Last Updated:** November 9, 2025
**WCAG Version:** 2.1 Level AA
**Status:** Compliant

---

## Our Commitment

Agenseek is committed to ensuring digital accessibility for people of all abilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.

---

## Conformance Status

Agenseek **conforms** to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. These guidelines explain how to make web content more accessible for people with disabilities and user-friendly for everyone.

---

## Accessibility Features

### 1. Keyboard Navigation

- **Full keyboard support**: All interactive elements are accessible via keyboard
- **Visible focus indicators**: 2px emerald outline on focused elements
- **Logical tab order**: Sequential navigation through all pages
- **Skip to main content**: Press Tab on page load to skip to main content
- **Keyboard shortcuts**: See [Keyboard Shortcuts](./keyboard-shortcuts.md) for full list
- **Modal focus trapping**: Focus remains within modals until closed
- **Focus management**: Focus returns to trigger element after closing modals

### 2. Screen Reader Support

- **Semantic HTML**: Proper use of HTML5 landmarks (`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`)
- **ARIA labels**: All icon-only buttons have descriptive labels
- **ARIA landmarks**: Main, navigation, and complementary regions clearly marked
- **ARIA live regions**: Dynamic content changes announced (toasts, alerts)
- **Image alt text**: All images have descriptive alternative text
- **Form labels**: All form fields properly labeled and associated
- **Error announcements**: Form errors announced with `role="alert"`
- **Heading hierarchy**: Logical structure (h1 → h2 → h3, no skips)

### 3. Visual Accessibility

- **Color contrast**: Minimum 4.5:1 for normal text, 3:1 for large text and UI elements
- **Focus indicators**: Minimum 3:1 contrast ratio with background
- **Text resizing**: Supports up to 200% zoom without loss of functionality
- **Line height**: Minimum 1.5 times font size
- **Paragraph spacing**: Minimum 1.5 times line height
- **No color-only information**: Information conveyed through multiple means (color, icons, text)
- **Dark mode support**: (Coming soon) Full support with proper contrast ratios

### 4. Mobile Accessibility

- **Touch targets**: Minimum 44x44px tap targets
- **Touch spacing**: Minimum 8px between interactive elements
- **Pinch to zoom**: Enabled on all pages
- **Orientation support**: Works in both portrait and landscape
- **Mobile screen readers**: Compatible with TalkBack (Android) and VoiceOver (iOS)

### 5. Forms and Inputs

- **Visible labels**: All form fields have visible labels
- **Required field indicators**: Clearly marked with asterisk and text
- **Error messages**: Associated with fields via `aria-describedby`
- **Error announcements**: Errors announced to screen readers with `role="alert"`
- **Success messages**: Announced via toast notifications with `aria-live`
- **Autocomplete attributes**: Appropriate autocomplete values for common fields
- **Inline validation**: Validates on blur, not just on submit
- **Progress indication**: Multi-step forms show progress (onboarding wizard)

### 6. Content Accessibility

- **Hebrew language**: `lang="he"` attribute on HTML element
- **RTL support**: Full right-to-left text direction support
- **Clear language**: Content written clearly, minimal jargon
- **Descriptive links**: Links describe their destination (no "click here")
- **Readable fonts**: Varela Round font family, readable at all sizes
- **Responsive typography**: Font sizes scale appropriately on mobile

---

## Testing

### Automated Testing

Agenseek has been tested with:

- **Axe DevTools**: 0 critical violations
- **Lighthouse Accessibility**: Score ≥ 95
- **WAVE**: 0 errors

### Manual Testing

- **Keyboard navigation**: Full site tested with keyboard only
- **Screen readers**: Tested with NVDA (Windows) and VoiceOver (macOS)
- **Mobile screen readers**: Tested with TalkBack (Android) and VoiceOver (iOS)
- **Zoom testing**: Tested at 200% browser zoom
- **Color contrast**: All text and UI elements verified with WebAIM Contrast Checker
- **Real devices**: Tested on iPhone, Android, tablets, and desktop browsers

### Browsers Tested

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## Known Issues

Currently, there are no known accessibility issues. If you encounter any problems, please contact us.

---

## Feedback

We welcome your feedback on the accessibility of Agenseek. Please let us know if you encounter accessibility barriers:

- **Email**: accessibility@agenseek.com (placeholder)
- **GitHub Issues**: [Report accessibility issue](https://github.com/agenseek/agenseek/issues)

We aim to respond to accessibility feedback within 2 business days.

---

## Technical Specifications

- **Standards**: WCAG 2.1 Level AA
- **Technologies**: HTML5, CSS3, TypeScript, React, Tailwind CSS
- **Assistive technologies**: Compatible with major screen readers, keyboard navigation, voice control
- **Component library**: Radix UI (with built-in accessibility features)

---

## Ongoing Efforts

Accessibility is an ongoing effort. We are continuously:

- Monitoring for accessibility issues
- Training our development team on accessibility best practices
- Conducting regular accessibility audits
- Gathering feedback from users with disabilities
- Updating content and features to improve accessibility

---

## Additional Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
- [Keyboard Shortcuts](./keyboard-shortcuts.md)

---

**Document Version:** 1.0
**Last Reviewed:** November 9, 2025
**Next Review:** March 9, 2026

