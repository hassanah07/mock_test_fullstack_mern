export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin/"
    },
    sitemap: `${process.env.FRONTEND_LINK}/sitemap.xml`
  };
}
