import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import basicSsl from '@vitejs/plugin-basic-ssl'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    proxy: {
      "/api": {
      target: "http://wtt-backend:8000",
      secure: false, // Kehityspalvelimen yhteys backendiin on salaamaton
      changeOrigin: true, // Tämä ottaa backendin osoitteen ja muuttaa sen niin, kuin olisi itse luonut sen
    },
    "/docs": "http://wtt-backend:8000",
    "/openapi.json": "http://wtt-backend:8000"
    }
  },
  build: {
    outDir: 'build', // Change to 'build' if needed
  }
})
