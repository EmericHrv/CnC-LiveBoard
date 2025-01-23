import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js', // Spécifiez PostCSS si nécessaire
  },
  build: {
    outDir: 'dist', // Répertoire de sortie pour les fichiers de production
    rollupOptions: {
      output: {
        // Structure des fichiers générés
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  },
  server: {
    host: true, // Permet d'accéder au serveur sur le réseau local
    port: 3000, // Définit le port par défaut pour le développement
  },
});
