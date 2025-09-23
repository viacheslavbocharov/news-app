import tailwind from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import viteCompression from "vite-plugin-compression";
import Inspect from "vite-plugin-inspect";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

function virtualFlags() {
  const id = "virtual:flags";
  return {
    name: "virtual-flags",
    resolveId(source: string) {
      if (source === id) return id;
    },
    load(source: string) {
      if (source === id) {
        const isProd = process.env.NODE_ENV === "production";
        return `
          export const IS_PROD = ${isProd};
          export const APP_NAME = "news-app";
        `;
      }
    },
  };
}
// Как использовать в коде
// Теперь в любом месте проекта можно импортировать «виртуальный модуль»:
// import { IS_PROD, APP_NAME } from "virtual:flags";
// console.log(IS_PROD);   // true или false
// console.log(APP_NAME);  // "news-app"

export default defineConfig({
  plugins: [
    react(),
    tailwind(),
    tsconfigPaths(),
    svgr(),
    checker({
      typescript: true,
    }),

    viteCompression({ algorithm: "brotliCompress" }),

    Inspect(),

    {
      ...visualizer({
        filename: "stats.html",
        gzipSize: true,
        brotliSize: true,
        open: true, // true — чтобы автОткрывал отчет после билда
      }),
      apply: "build",
    },
    virtualFlags(),
  ],

  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      format: { comments: false },
      mangle: true,
    },
  },
  server: { host: "localhost", port: 5174 },
});
