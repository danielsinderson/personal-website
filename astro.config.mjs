import { defineConfig } from 'astro/config';
import rehypeTaskProgress from './src/plugins/rehype-task-progress.mjs';

// https://astro.build/config
export default defineConfig({
  markdown: {
    rehypePlugins: [rehypeTaskProgress],
  },
});
