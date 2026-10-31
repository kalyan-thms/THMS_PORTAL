import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    host: true,
    watch: {
      usePolling: true,
      interval: 1000
    }
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          jspdf: ['jspdf', 'jspdf-autotable'],
          vendor: ['react', 'react-dom', 'lucide-react']
        }
      }
    }
  }
});
