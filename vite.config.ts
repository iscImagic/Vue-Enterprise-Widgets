import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => ({
  plugins: [vue(), vueDevTools(), tailwindcss()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  ...(mode === 'widget'
    ? {
        build: {
          outDir: 'public/widgets',
          emptyOutDir: false,

          lib: {
            entry: {
              calculator: fileURLToPath(
                new URL('./src/widgets/calculator/entry.ts', import.meta.url),
              ),
              'contact-form': fileURLToPath(
                new URL('./src/widgets/contact-form/entry.ts', import.meta.url),
              ),
            },
            formats: ['es'] as const,
            fileName: (_format: string, entryName: string) => `${entryName}.js`,
          },

          rollupOptions: {
            external: ['vue'],
          },
        },
      }
    : {}),
}))
