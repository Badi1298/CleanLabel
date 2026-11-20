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
			includeAssets: [
				"favicon.ico",
				"logo-192x192.png",
				"logo-512x512.png",
				"pickitwell-logo.png",
			],
			devOptions: {
				enabled: true,
			},
			manifestFilename: "manifest.json",
			manifest: {
				id: "/",
				name: "PickItWell",
				short_name: "PickItWell",
				description:
					"PickItWell — Produse alimentare selectate după aditivii marcați pe etichetă.",
				theme_color: "#1B4332",
				background_color: "#1B4332",
				display: "standalone",
				start_url: "/",
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
