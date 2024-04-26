import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@utils': '/src/utils',
      '@assets': '/src/assets',
      '@components': '/src/components',
      '@styles': '/src/styles',
      '@pages': '/src/pages',
      '@fonts': 'src/fonts',
      '@constants': '/src/constants',
      '@contexts': '/src/contexts',
      '@customTypes': '/src/customTypes',
      '@hooks': '/src/hooks',
      '@services': '/src/services',
    },
  },
});
