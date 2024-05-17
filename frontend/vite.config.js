import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.bmp']
  // Pas besoin d'ajouter assetsInclude si vous utilisez le dossier public correctement.
})
