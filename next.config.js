/**
 * For GitHub Pages, set the repo subpath.
 * The workflow sets NEXT_BASE_PATH to /{repo} (e.g. /AntiADHD).
 * Local: omit NEXT_BASE_PATH so dev is at the site root.
 */
const basePath = process.env.NEXT_BASE_PATH || ''

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  ...(basePath
    ? { basePath, assetPrefix: basePath + '/' }
    : {}),
  // Inlined so the root layout can link favicon/manifest under a GitHub project path
  env: {
    SITE_BASE_PATH: basePath,
  },
}

module.exports = nextConfig
