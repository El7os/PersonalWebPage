import type { NextConfig } from 'next'
import createMDX from '@next/mdx'

// Set by the GitHub Pages workflow: "/PersonalWebPage" for a project page,
// "" for a user page or a custom domain. Empty during local development.
const basePath = process.env.PAGES_BASE_PATH ?? ''

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  // GitHub Pages only serves static files.
  output: 'export',
  // Emit blog/index.html instead of blog.html, so /blog/ and the post folders under it don't clash.
  trailingSlash: true,
  // The image optimizer needs a server.
  images: { unoptimized: true },

  basePath,
  // Exposed to the client so plain <img>, CSS url() and next/image sources can be prefixed (see src/lib/basePath.ts).
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-math'],
    rehypePlugins: ['rehype-katex'],
  },
})

export default withMDX(nextConfig)
