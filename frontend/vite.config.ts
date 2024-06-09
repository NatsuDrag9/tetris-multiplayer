// import { defineConfig } from 'vite';
import { defineConfig as defineViteConfig, mergeConfig } from 'vite';
import { defineConfig as defineVitestConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
const viteConfig = defineViteConfig({
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

const vitestConfig = defineVitestConfig({
  test: {
    setupFiles: ['vitest-localStorage-mock'],
    mockReset: false,
  },
});

export default mergeConfig(viteConfig, vitestConfig);
