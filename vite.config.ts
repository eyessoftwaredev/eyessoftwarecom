import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'lucide-react/dist/esm/icons/fingerprint.js': path.resolve(__dirname, 'src/icons/fingerprint.js'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
