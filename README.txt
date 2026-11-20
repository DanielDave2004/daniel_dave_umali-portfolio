MODAL CURSOR + SIDEBAR SCROLLBAR FIX

Copy src/ into the root of your existing my-portfolio project, replacing the two matching files.

Changes:
- Cursor layer stays above Resume, Project, and Achievement modals.
- Improved cursor contrast over dialog backgrounds.
- Thin grayscale sidebar scrollbar with hover states.
- Sidebar scrolls only when content exceeds the available height.
- Mobile navigation drawer continues to scroll independently.
- Respects reduced-motion and touch preferences.

Run npm run dev. No dependency changes.

Note: PDFs embedded inside browser iframes manage their own native pointer; the custom cursor cannot track mouse movement inside the embedded PDF itself.
