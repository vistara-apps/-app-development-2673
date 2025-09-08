import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit to 1000kB
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignore warnings about pure annotations
        if (warning.code === 'INVALID_ANNOTATION') return;
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
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'wagmi', '@rainbow-me/rainbowkit', 'viem']
  }
})
