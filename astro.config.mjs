// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import svelte from '@astrojs/svelte';

export default defineConfig({
  // The live domain, used for canonical URLs.
  site: 'https://mondaymorningcatholic.com',
  integrations: [mdx(), svelte()],
});
