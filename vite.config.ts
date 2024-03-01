import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

export default defineConfig({
	plugins: [react()],
	build: {
		rollupOptions: {
			input: {
				main: fileURLToPath(new URL('./src/quill.mention.ts', import.meta.url))
			},
			output: [
				{
					format: 'es',
					entryFileNames: '[name].js',
					chunkFileNames: '[name].js',
					assetFileNames: '[name].[ext]'
				},
				{
					format: 'cjs',
					entryFileNames: '[name].cjs',
					chunkFileNames: '[name].cjs',
					assetFileNames: '[name].[ext]'
				},
				{
					format: 'umd',
					name: 'QuillMention',
					entryFileNames: '[name].umd.js',
					chunkFileNames: '[name].umd.js',
					assetFileNames: '[name].[ext]'
				}
			],
			external: ['react', 'react-dom']
		}
	}
})
