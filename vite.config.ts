import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// On GitHub Pages the app is hosted under /<repository>/, not the domain root.
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS && repo ? `/${repo}/` : '/',
  build: { sourcemap: true },
});
