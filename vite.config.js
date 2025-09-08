import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit to 1000kB
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress warnings about pure annotations and ox library issues
        if (warning.code === 'INVALID_ANNOTATION') return;
        if (warning.message && warning.message.includes('ox')) return;
        warn(warning);
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          wagmi: ['wagmi', '@rainbow-me/rainbowkit', 'viem'],
        }
      }
    },
    commonjsOptions: {
      transformMixedEsModules: true
    },
    target: 'esnext',
    minify: false, // Disable minification to avoid terser issues
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@rainbow-me/rainbowkit',
      'wagmi',
      'viem',
      '@tanstack/react-query',
      'lucide-react',
      'axios',
      '@supabase/supabase-js',
      'openai'
    ]
  },
  define: {
    global: 'globalThis',
  }
})
