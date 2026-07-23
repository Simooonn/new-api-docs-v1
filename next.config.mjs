import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        'docs.acetoken.top',
        'www.acetoken.top',
        'acetoken.top',
        // upstream legacy origins (kept to minimize sync diff)
        // newapi.pro domains
        'docs.newapi.pro',
        'newapi.pro',
        'www.newapi.pro',
        // newapi.ai domains
        'docs.newapi.ai',
        'newapi.ai',
        'www.newapi.ai',
        // Vercel preview
        'new-api-docs-v1.vercel.app',
      ],
    },
  },
  async headers() {
    return [
      {
        // Apply charset to HTML pages
        source: '/:lang(en|zh|ja)/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/html; charset=utf-8',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/:lang(en|zh|ja)/docs',
        destination: '/:lang/docs/api',
        permanent: false, // 307
      },
      {
        source: '/:lang(en|zh|ja)/docs/',
        destination: '/:lang/docs/api',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/:lang/docs/:path*.mdx',
        destination: '/:lang/llms.mdx/:path*',
      },
    ];
  },
};

export default withMDX(config);
