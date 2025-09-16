// next-sitemap.config.js  (프로젝트 루트)
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  generateRobotsTxt: true,       // robots.txt 자동 생성
  outDir: 'public',              // public/ 아래에 sitemap/robots 생성
  exclude: [
    '/api/*',
    '/auth/*',
    '/dashboard',
    '/mypage',
    '/saved',
    '/settings/*',
    '/login',
  ],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/api/*','/auth/*','/dashboard','/mypage','/saved','/settings/*','/login'] },
    ],
  },
  // 필요 시:
  // changefreq: 'weekly',
  // priority: 0.7,
  // trailingSlash: false, // Next.js 기본과 맞추기
}
