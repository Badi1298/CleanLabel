import { paraglideVitePlugin } from "@inlang/paraglide-js";
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
		paraglideVitePlugin({
			project: "./project.inlang",
			outdir: "./src/paraglide",
			strategy: ["cookie", "preferredLanguage", "baseLocale"],
			cookieName: "PARAGLIDE_LOCALE",
			cookieMaxAge: 60 * 60 * 24 * 365,
			cookieSameSite: "lax",
			emitTsDeclarations: true,
		}),
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
				"apple-touch-icon.png",
				"logo-192x192.png",
				"logo-512x512.png",
				"logo-maskable-192x192.png",
				"logo-maskable-512x512.png",
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
						purpose: "any",
					},
					{
						src: "/logo-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "any",
					},
					{
						src: "/logo-maskable-192x192.png",
						sizes: "192x192",
						type: "image/png",
						purpose: "maskable",
					},
					{
						src: "/logo-maskable-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "maskable",
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
