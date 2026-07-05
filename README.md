# SuzzyPro Delivery — Website

A premium, responsive courier & logistics website built with HTML5, CSS3, and vanilla JavaScript. No build step, no dependencies — open and go.

## Folder structure

```
suzzypro-delivery/
├── index.html          Home page
├── about.html           Company story, mission, team, timeline
├── services.html         10 service details, quote form
├── tracking.html         Live shipment tracking interface
├── contact.html          Contact form, map, business hours
├── robots.txt
├── sitemap.xml
├── css/
│   ├── style.css        Design tokens, layout, components
│   ├── animations.css    Keyframes, scroll-reveal engine
│   └── responsive.css    Tablet/mobile breakpoints
├── js/
│   ├── main.js           Nav, counters, FAQ, forms, cookie banner
│   ├── animations.js      IntersectionObserver scroll reveals
│   └── tracking.js        Shipment database + tracking lookup
├── images/                Placeholder folders for hero, icons, services, testimonials, logos
└── assets/                Placeholder folders for fonts, video
```

## Running locally

No build tools required. Two options:

1. **Just open it** — double-click `index.html` to open in your browser.
2. **Local server (recommended)** — for correct relative-path behavior and to test the tracking redirect flow:

   ```bash
   # Python 3
   cd suzzypro-delivery
   python3 -m http.server 8080
   # then visit http://localhost:8080
   ```

   ```bash
   # Node (if you have npx)
   npx serve suzzypro-delivery
   ```

## Testing the tracking feature

Go to `tracking.html` (or use the widget on the home page) and try any of these sample tracking numbers:

| Tracking Number | Status |
|---|---|
| `SPD24589712` | In Transit (Lagos → Abuja) |
| `SPD56321478` | Out for Delivery |
| `SPD98451237` | Delivered |
| `SPD77541265` | Sorting Facility |
| `SPD10983456` | International Transit |

Any other value (e.g. `SPD00000000`) returns **"No shipment found."** Lookups are case-insensitive. The shipment database lives in `js/tracking.js` (`SHIPMENT_DB`) — add or edit entries there.

## Customizing

- **Colors & type** live in `css/style.css` under `:root` — change the CSS variables once, and the whole site updates.
- **Images**: the `images/` folders are placeholders. Drop in real photography (hero shots, driver/rider photos, service icons) at matching aspect ratios; the SVG icon system in the markup can stay as-is or be swapped for image-based icons.
- **Fonts**: currently loaded from Google Fonts (Poppins + Inter) via CDN link tags in each page `<head>`. For offline use, download the font files into `assets/fonts/` and replace the `<link>` tags with local `@font-face` rules.
- **Forms**: the contact, quote, and newsletter forms currently simulate submission client-side (loading state → success message). Wire them to your backend or a form service (Formspree, Netlify Forms, etc.) by replacing the `fetch`/`setTimeout` logic in `js/main.js`.

## Browser support

Built with standard, widely-supported CSS (Grid, custom properties, `backdrop-filter`) and vanilla JS (`IntersectionObserver`, ES6). Works in all modern evergreen browsers. `prefers-reduced-motion` is respected throughout.
