import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import dts from 'vite-plugin-dts'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig({
	build: {
		lib: {
			entry: fileURLToPath(new URL('./src/quill.mention.ts', import.meta.url)),
			name: 'index',
			formats: ['es'],
			fileName: 'index'
		},
		rollupOptions: {
			external: ['react', 'react-dom', 'quill', 'quill-mention-react']
		}
	},
	plugins: [react(), dts({ insertTypesEntry: true, exclude: ['example'] }), cssInjectedByJsPlugin()]
})
