const { withContentlayer } = require('next-contentlayer')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// You might need to insert additional domains in script-src if you are using external services
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' giscus.app *.googletagmanager.com va.vercel-scripts.com;
  style-src 'self' 'unsafe-inline';
  img-src * blob: data:;
  media-src *.s3.amazonaws.com;
  connect-src *;
  font-src 'self' fonts.gstatic.com;
  frame-src giscus.app *.youtube.com
`

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ''),
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

const Redirects = [
  {
    source: '/',
    destination: '/blog',
    permanent: true,
  },
  {
    source: '/pandora-ctf',
    destination: '/blog/pandora-ctf',
    permanent: false,
  },
  {
    source: '/ctf-antique',
    destination: '/blog/ctf-antique',
    permanent: false,
  },
  {
    source: '/ideas-de-post',
    destination: '/blog/ideas-de-post',
    permanent: false,
  },
  {
    source: '/sql-injection-para-dummies',
    destination: '/blog/sql-injection-para-dummies',
    permanent: false,
  },
  {
    source: '/ctf-nodeblog-writeup',
    destination: '/blog/ctf-nodeblog-writeup',
    permanent: false,
  },
  {
    source: '/permitir-subir-archivos-a-tu-web-es-peligroso',
    destination: '/blog/permitir-subir-archivos-a-tu-web-es-peligroso',
    permanent: false,
  },
  {
    source: '/ctf-validation',
    destination: '/blog/ctf-validation',
    permanent: false,
  },
  {
    source: '/ctf-horizontall',
    destination: '/blog/ctf-horizontall',
    permanent: false,
  },
  {
    source: '/ctf-return',
    destination: '/blog/ctf-return',
    permanent: false,
  },
  {
    source: '/ctf-anubis-writeup',
    destination: '/blog/ctf-anubis-writeup',
    permanent: false,
  },
  {
    source: '/ctf-jeeves',
    destination: '/blog/ctf-jeeves',
    permanent: false,
  },
  {
    source: '/docker-puede-ser-un-problema-de-seguridad',
    destination: '/blog/docker-puede-ser-un-problema-de-seguridad',
    permanent: false,
  },
  {
    source: '/ctf-epsilon',
    destination: '/blog/ctf-epsilon',
    permanent: false,
  },
  {
    source: '/ctf-previse',
    destination: '/blog/ctf-previse',
    permanent: false,
  },
  {
    source: '/ejpt-review-2022',
    destination: '/blog/ejpt-review-2022',
    permanent: false,
  },
  {
    source: '/ctf-soccer-write-up',
    destination: '/blog/ctf-soccer-write-up',
    permanent: false,
  },
  {
    source: '/osint-redes-inalambricas',
    destination: '/blog/osint-redes-inalambricas',
    permanent: false,
  },
  {
    source: '/mentor-ctf',
    destination: '/blog/mentor-ctf',
    permanent: false,
  },
  {
    source: '/ctf-ambassador-writeup',
    destination: '/blog/ctf-ambassador-writeup',
    permanent: false,
  },
  {
    source: '/wifi-pineapple-mkvii',
    destination: '/blog/wifi-pineapple-mkvii',
    permanent: false,
  },
  {
    source: '/symfony-1-y-2',
    destination: '/blog/symfony-1-y-2',
    permanent: false,
  },
  {
    source: '/symfonos-1-y-2-write-up',
    destination: '/blog/symfonos-1-y-2-write-up',
    permanent: false,
  },
  {
    source: '/por-que-deberias-proteger-node-red',
    destination: '/blog/por-que-deberias-proteger-node-red',
    permanent: false,
  },
  {
    source: '/no-twitter-no-ha-dejado-de-ser-seguro',
    destination: '/blog/no-twitter-no-ha-dejado-de-ser-seguro',
    permanent: false,
  },
  {
    source: '/despliega-una-web-en-la-red-tor-deep-web',
    destination: '/blog/despliega-una-web-en-la-red-tor-deep-web',
    permanent: false,
  },
  {
    source: '/ciberseguridad-en-redes-ot-vs-redes-it-que-son-y-como-protegerlas',
    destination: '/blog/ciberseguridad-en-redes-ot-vs-redes-it-que-son-y-como-protegerlas',
    permanent: false,
  },
  {
    source: '/retrogasteiz',
    destination: '/blog/retrogasteiz',
    permanent: false,
  },
]

/**
 * @type {import('next/dist/next-server/server/config').NextConfig}
 **/
module.exports = () => {
  const plugins = [withContentlayer, withBundleAnalyzer]
  return plugins.reduce((acc, next) => next(acc), {
    reactStrictMode: true,
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    eslint: {
      dirs: ['app', 'components', 'layouts', 'scripts'],
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'picsum.photos',
        },
      ],
    },
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: securityHeaders,
        },
      ]
    },
    webpack: (config, options) => {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      })

      return config
    },
    async redirects() {
      return Redirects
    },
  })
}
