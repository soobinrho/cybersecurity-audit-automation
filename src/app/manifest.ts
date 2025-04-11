import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  const title = process.env.NEXT_PUBLIC_TITLE || "";
  const description = process.env.NEXT_PUBLIC_DESCRIPTION || "";
  return {
    name: title,
    short_name: title,
    description: description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
