// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import svelte from '@astrojs/svelte';

export default defineConfig({
  // Set this to the real domain once it is registered.
  site: 'https://mondaymorningcatholic.com',
  integrations: [mdx(), svelte()],
});
