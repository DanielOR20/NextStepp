import { defineConfig } from 'vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        inicio: resolve(__dirname, 'inicio.html'),
        perfil: resolve(__dirname, 'perfil.html'),
        empleos: resolve(__dirname, 'empleos.html'),
        calificaciones: resolve(__dirname, 'calificaciones.html'),
        ia: resolve(__dirname, 'ia.html'),
        postulaciones: resolve(__dirname, 'src/pages/postulaciones/postulaciones.html'),
      },
    },
  },
})
