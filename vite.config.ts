import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import dts from 'vite-plugin-dts'

export default defineConfig({
	plugins: [react(), dts({ insertTypesEntry: true, include: ['src/quill.mention.ts'] })],
	build: {
		lib: {
			entry: fileURLToPath(new URL('./src/quill.mention.ts', import.meta.url)),
			name: 'index',
			formats: ['es'],
			fileName: 'index'
		}
	}
})
