# UI_SYSTEM.md

The entire UI is one page, styled by one plain CSS file:
`/Users/gariyuu/Projects/click-to-send/index.html` +
`/Users/gariyuu/Projects/click-to-send/style.css`. No CSS framework, no
CSS-in-JS, no preprocessor (no Sass/Less/PostCSS config found), no design
tokens file, no component library.

## Layout

- `body` is a flex container (`display:flex; align-items:center;
  justify-content:center; min-height:100vh`) that centers a single
  `.card` element both vertically and horizontally — the entire page is
  one centered card, no header/footer/nav.
- `.card` is `width:100%; max-width:420px; padding:32px;` with rounded
  corners (`border-radius:12px`) and a drop shadow
  (`box-shadow:0 8px 24px rgba(0,0,0,0.4)`).
- Inside the card, top to bottom: `<h1>Click to Send</h1>`, a `.subtitle`
  paragraph, four form controls stacked vertically (`#recipient`,
  `#discord-ids`, `#message` textarea, `#passcode`), a `.buttons` flex row
  with two buttons, and a `.status` paragraph for feedback text.

## Styling approach (`style.css`, ~92 lines total)

- Global reset: `* { box-sizing: border-box; }`.
- `body` font stack: `-apple-system, BlinkMacSystemFont, "Segoe UI",
  Roboto, sans-serif` (system font stack, no web font loaded).
- No media queries anywhere — the `max-width:420px` card plus a
  full-viewport flex-centered `body` is itself naturally responsive down
  to small screens (the card just shrinks to fill available width below
  420px, per `width:100%`).

## Colors

Hardcoded hex values directly in `style.css` — no CSS custom properties,
no theme system, no light/dark mode toggle (the page is permanently dark):

| Value | Used for |
|---|---|
| `#0f1115` | Page background (`body`) |
| `#1a1d24` | Card background (`.card`) |
| `#e8e8e8` | Primary text color (`body`, inputs/textarea text) |
| `#9aa0aa` | Subtitle text (`.subtitle`) |
| `#333844` | Input/textarea border |
| `#12141a` | Input/textarea background |
| `#d44638` | "Send Email" button background (`#send-email`) — a Gmail-red |
| `#5865f2` | "Send Discord DM" button background (`#send-discord`) — Discord's brand blurple |
| `rgba(0,0,0,0.4)` | Card drop shadow |

## Typography

- No custom font loaded (no `@font-face`, no Google Fonts link, no
  `next/font`-equivalent — this isn't a Next.js project).
- `h1`: `font-size:1.5rem`.
- `.subtitle`: `font-size:0.9rem`, colored `#9aa0aa`.
- Inputs/textarea: `font-size:0.95rem`, `font-family:inherit`.
- Buttons: `font-size:0.9rem`, `font-weight:600`.
- `.status`: `font-size:0.85rem`.

## Spacing

No spacing scale/tokens — literal pixel values used ad hoc throughout
(`padding:32px` on the card, `padding:12px` on inputs, `margin-top:10px`
between inputs, `gap:10px` in `.buttons`, `margin-top:16px` before the
button row, `margin-top:14px` before `.status`). Consistent by
convention/eyeballing, not by a defined system.

## Interactive states

- `button:disabled { opacity:0.5; cursor:not-allowed; }` — both send
  buttons get this treatment while a request is in flight (`script.js`
  sets `.disabled = true` at the start of each click handler and `false`
  in a `finally` block).
- `button { transition: opacity 0.15s; }` — the only transition/animation
  in the entire stylesheet.
- No `:hover`/`:focus` states are explicitly styled beyond browser
  defaults — verified by reading the full `style.css`; no `:hover` or
  `:focus` selector appears anywhere in the file.

## Accessibility

- No explicit ARIA attributes anywhere in `index.html`.
- Inputs rely on `placeholder` text for labeling, not `<label>` elements
  — there is no `<label for="...">` anywhere in the markup. This means
  screen readers announce the field via its placeholder (a known weaker
  pattern than a real `<label>`, since placeholder text disappears once
  a value is typed and isn't always announced consistently across screen
  readers).
- The passcode input is `type="password"` with `autocomplete="off"` —
  masks the value visually and discourages the browser from offering to
  save/autofill it (does not otherwise add any security).
- Buttons are native `<button>` elements (good — native focus/keyboard/
  activation semantics come for free), not `<div onclick>` or similar.
- No documented color-contrast audit was performed. Spot-check: primary
  text `#e8e8e8` on card background `#1a1d24` and page background
  `#0f1115` both read as high-contrast by eye; subtitle text `#9aa0aa` on
  `#1a1d24` is a lower-contrast muted gray, consistent with its role as
  secondary text, but no formal WCAG contrast ratio calculation was
  performed this audit.

## Responsive design

No breakpoints defined. The single `.card` (`max-width:420px`, `width:
100%`) inside a full-viewport centered flex `body` is the entire
responsive strategy — it degrades gracefully on narrow viewports by
simply shrinking to the viewport width, and stays capped at 420px wide on
larger screens. Not tested this audit against real narrow/mobile
viewports (no visual browser check was performed as part of this
documentation-only pass) — flagged as **Unable to verify visually**, only
verified by reading the CSS rules.

## Assets

- One inline data-URI favicon in `index.html`'s `<link rel="icon"
  href="data:image/svg+xml,...">` — an emoji (📤, outgoing-message emoji)
  rendered as SVG text, added in commit `8fbe66d`. No separate favicon
  file exists in the repo.
- No images, icon fonts, or icon libraries are used anywhere else.
