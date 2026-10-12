import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const apiUrl = env.API_URL || env.VITE_API_URL || '/api';
  const clerkPublishableKey =
    env.CLERK_PUBLISHABLE_KEY || env.VITE_CLERK_PUBLISHABLE_KEY || '';

  return {
    plugins: [react(), tailwindcss()],
    // Expose API_URL to the client; do NOT prefix CLERK_ (would leak CLERK_SECRET_KEY).
    envPrefix: ['API_'],
    define: {
      'import.meta.env.API_URL': JSON.stringify(apiUrl),
      'import.meta.env.CLERK_PUBLISHABLE_KEY': JSON.stringify(clerkPublishableKey),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api': 'http://localhost:5000',
      },
    },
  };
});
