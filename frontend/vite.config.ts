import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Determine the value of VITE_ENV based on your logic
const environment = 'testing'; // or 'production' or 'testing', etc.

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_ENV': JSON.stringify(environment),
  },
});
