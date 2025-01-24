import type { APIRoute } from "astro";
import LinksData, { Links } from "~/domain/data/Links";

export const GET: APIRoute = () => {
  const targetUrl = LinksData.find((l) => l.id === Links.itchio)!.url;
  return new Response("", {
    status: 308,
    headers: {
      'Location': targetUrl,
      'Content-Type': 'text/plain'
    }
  });
};
