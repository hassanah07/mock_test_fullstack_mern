export default async function sitemap() {
  const baseUrl = process.env.FRONTEND_LINK;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_HOST_SSR}/api/blogpost/sitemap`,
    {
      cache: "no-cache",
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  const data = await response.json();

  const postUrls = Object.keys(data).map((item) => ({
    url: `${baseUrl}/blog/${data[item].slug}`,
    lastModified: data[item].updatedAt,
    changeFrequency: "daily",
    priority: 1.0
  }));
  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date(), priority: 0.5 },
    {
      url: `${baseUrl}/career`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0
    },
    { url: `${baseUrl}/news`, lastModified: new Date(), priority: 0.1 },
    { url: `${baseUrl}/medicine`, lastModified: new Date(), priority: 0.1 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), priority: 0.1 },
    { url: `${baseUrl}/talk`, lastModified: new Date(), priority: 0.1 },
    ...postUrls
  ];
}
