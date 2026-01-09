import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'static',
  adapter: vercel(),
  site: 'https://voxmosaic.com',
  vite: {
    css: {
      devSourcemap: true
    }
  }
});
