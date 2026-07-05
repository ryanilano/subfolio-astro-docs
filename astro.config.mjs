// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
// Served at the raw GitHub Pages *project* path (D-05): site = the user's Pages
// origin, base = the repo name with leading + trailing slash. `base` MUST stay at
// the top level of defineConfig — never under a `vite:` key (RESEARCH Pitfall 5).
export default defineConfig({
  site: 'https://ryanilano.github.io',
  base: '/subfolio-astro-docs/',
  integrations: [
    starlight({
      title: 'subfolio-astro-docs',
    }),
  ],
});
