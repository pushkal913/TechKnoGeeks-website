import { defineConfig } from 'astro/config';

// Static site. Output goes to ./dist and is what Netlify deploys.
export default defineConfig({
  site: 'https://www.techknogeeks.com',
  build: {
    // Emit /about-us.html (served at /about-us) to match the existing clean URLs.
    format: 'file',
  },
  // The exported Zoho theme ships its own large CSS; don't let Astro try to
  // re-scope or inline-optimize the raw HTML we inject verbatim.
  scopedStyleStrategy: 'where',
});
