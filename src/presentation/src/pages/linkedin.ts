import type { APIRoute } from "astro";
import LinksData, { Links } from "~/domain/data/Links";

export const GET: APIRoute = () => {
  const targetUrl = LinksData.find((l) => l.id === Links.linkedin)!.url;
  return new Response(null, {
    status: 301,
    headers: {
      Location: targetUrl
    }
  });
};
