import type { NextConfig } from "next";

// Site 100% estático para o GitHub Pages: `next build` gera a pasta out/.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  experimental: {
    // 404 única para rotas inexistentes (o app tem mais de um layout raiz).
    globalNotFound: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
