import NextMdx from "@next/mdx";

import remarkGfm from "remark-gfm"
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // output: 'export',

  // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
  // trailingSlash: true,

  // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
  // skipTrailingSlashRedirect: true,

  // Optional: Change the output directory `out` -> `dist`
  // distDir: 'dist',
};

const withMDX = NextMdx({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm], // ✅
    // remarkPlugins: [remarkPrism], // ESM ❌
  },
});
const CustomNextConfig = withMDX({
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  ...nextConfig,
});

export default CustomNextConfig;
