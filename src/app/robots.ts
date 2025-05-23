import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const url = `${process.env.NEXT_PUBLIC_URL}`;
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${url}/sitemap.xml`,
  };
}
