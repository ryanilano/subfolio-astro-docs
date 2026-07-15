// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import lucode from 'lucode-starlight';

// https://astro.build/config
// Served at the raw GitHub Pages *project* path (D-05): site = the user's Pages
// origin, base = the repo name with leading + trailing slash. `base` MUST stay at
// the top level of defineConfig — never under a `vite:` key (RESEARCH Pitfall 5).
export default defineConfig({
  site: 'https://ryanilano.github.io',
  base: '/subfolio-astro-docs/',
  integrations: [
    starlight({
      title: 'Subfolio-Astro Docs',
      customCss: ['./src/styles/font.css'],
      sidebar: [
        { label: 'Getting Started', slug: 'docs/getting-started' },
        {
          label: 'Conventions',
          items: [
            { label: 'Position Embeds', slug: 'docs/conventions/embeds' },
            { label: 'Enhancers', slug: 'docs/conventions/enhancers' },
            { label: 'Folder Suffixes', slug: 'docs/conventions/folder-suffixes' },
            { label: 'Hidden Items', slug: 'docs/conventions/hidden-items' },
            { label: '-access', slug: 'docs/conventions/access' },
            { label: 'Thumbnails', slug: 'docs/conventions/thumbnails' },
          ],
        },
        { label: 'Changes & Improvements', slug: 'docs/changes' },
        {
          label: 'The Port Journey',
          items: [
            { label: 'Overview', slug: 'docs/journey' },
            { label: 'Why the Port', slug: 'docs/journey/why-the-port' },
            { label: 'Architecture', slug: 'docs/journey/architecture' },
            { label: 'The DeepSeek Workflow', slug: 'docs/journey/deepseek-workflow' },
            { label: 'Performance', slug: 'docs/journey/performance' },
            { label: 'SEO', slug: 'docs/journey/seo' },
            { label: 'Security', slug: 'docs/journey/security' },
            { label: 'Deploying for Free', slug: 'docs/journey/free-deploy' },
          ],
        },
      ],
      plugins: [
        lucode({
          // THEME-02: internal links are base-relative paths WITHOUT the
          // /subfolio-astro-docs/ prefix baked in — lucode's NavBar.astro
          // routes every non-absolute nav.link through Astro's
          // getRelativeLocaleUrl(), which itself prepends the configured
          // `base` (verified from node_modules/lucode-starlight/components/
          // overrides/parts/NavBar.astro + astro/dist/virtual-modules/i18n.js).
          // Baking the prefix in here double-prefixes the rendered href
          // (RESEARCH's stated Pitfall 2 did not hold for this navLinks
          // renderer — deviation documented in SUMMARY). Demo link is
          // absolute/external and passes through untouched.
          navLinks: [
            { label: 'Docs', link: '/docs/getting-started/' },
            { label: 'Conventions', link: '/docs/conventions/embeds/' },
            { label: 'Changes', link: '/docs/changes/' },
            { label: 'Journey', link: '/docs/journey/' },
            { label: 'Demo', link: 'https://ryanilano.github.io/subfolio-astro/' },
          ],
          // CONT-04: canonical AGPL-3.0 / AREA17 / port attribution, reused
          // verbatim from content/examples/-b-footer.txt (engine repo) + this
          // repo's README §License — NOT lucode's default "Inspired by
          // shadcn/ui" credit (RESEARCH Pitfall 5).
          footerText:
            '© 2026 Subfolio-Astro by Ryan Ilano. An Astro port of [Subfolio](https://github.com/area17/subfolio) by [AREA17](https://area17.com) [[AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.html)] — [source](https://github.com/ryanilano/subfolio-astro).',
        }),
      ],
    }),
  ],
});
