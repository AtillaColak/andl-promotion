// next-sitemap.config.js

module.exports = {
    siteUrl: process.env.SITE_URL || 'https://www.andl.io', // Change to your site's URL
    generateRobotsTxt: true, // (optional) Generate robots.txt
    changefreq: 'weekly', // How frequently pages are updated (e.g., daily, weekly)
    priority: 0.8, // Default priority for all pages
    exclude: ['/private-page'], // Exclude specific pages from the sitemap
    robotsTxtOptions: {
      policies: [
        {
          userAgent: '*',
          allow: '/',
        },
        {
          userAgent: 'Googlebot',
          allow: '/',
        },
        {
          userAgent: '*',
          disallow: '/private-page',
        },
      ],
    },
  };
  