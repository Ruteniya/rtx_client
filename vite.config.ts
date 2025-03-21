import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  resolve: {
    alias: Object.fromEntries(
      ['api', 'app', 'features', 'hooks', 'utils', 'services'].map((dir) => [
        `@${dir}`,
        path.resolve(__dirname, `./src/${dir}`)
      ])
    )
  },
  plugins: [react(), tailwindcss()]
})
