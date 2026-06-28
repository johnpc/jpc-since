/**
 * Brand fonts, bundled via fontsource (not a CDN) so the app works offline
 * inside Capacitor. Only the weights/styles the style guide uses are imported,
 * to keep the bundle lean.
 *
 * - Newsreader (serif): the big elapsed figures + headings.
 * - Inter (sans): UI chrome — labels, buttons, metadata.
 *
 * See docs/STYLE_GUIDE.md for the typographic scale.
 */

// Newsreader — 400 (body), 600 (headings + the elapsed figure)
import '@fontsource/newsreader/400.css';
import '@fontsource/newsreader/600.css';

// Inter — 400 (meta), 500 (labels), 600 (kickers/buttons)
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
