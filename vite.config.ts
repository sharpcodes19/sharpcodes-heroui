import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"

export default defineConfig({
	plugins: [
		react()
	],
	build: {
		lib: {
			entry: path.resolve(__dirname, "src/index.ts"),
			name: "YourReactApi",
			formats: ["es", "cjs"],
			fileName: (format) => `index.${format}.js`
		},
		rollupOptions: {
			external: [
				"react",
				"react-dom",
				"@tanstack/react-query",
				"@tanstack/react-table",
				"@heroui/react"
			]
		}
	}
})
