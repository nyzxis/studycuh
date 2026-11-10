import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'motion', 'katex'],
          businessData: ['./src/data/businessData.ts'],
          csoData: ['./src/data/csoData.ts'],
          databaseData: ['./src/data/databaseData.ts'],
          englishData: ['./src/data/englishData.ts'],
          mathsData: ['./src/data/mathsData.ts'],
        },
      },
    },
  },
  server: {
    port: 4173,
    strictPort: true,
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
});
