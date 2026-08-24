import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	plugins: [
		devtools(),
		tanstackStart(),
		nitro({ rollupConfig: { external: [/^@sentry\//] } }),
		tailwindcss(),
		viteReact(),
		babel({ presets: [reactCompilerPreset()] }),
		VitePWA({
			registerType: "autoUpdate",
			includeAssets: ["favicon.ico", "logo-192x192.png", "logo-512x512.png"],
			devOptions: {
				enabled: true,
			},
			manifest: {
				name: "CleanLabel",
				short_name: "CleanLabel",
				description: "CleanLabel Application",
				theme_color: "#ffffff",
				icons: [
					{
						src: "/logo-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "/logo-512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
				],
			},
		}),
	],
	build: {
		rollupOptions: {
			external: ["VitePWA"],
		},
	},
	server: {
		allowedHosts: ["earmuff-elephant-boney.ngrok-free.dev"],
	},
});

export default config;
