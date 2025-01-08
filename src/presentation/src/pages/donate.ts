import type { APIRoute } from "astro";
import LinksData, { Links } from "~/domain/data/Links";
import StatusCodes from "~/presentation/src/core/acore-ts/http/StatusCodes";

export const GET: APIRoute = ({ redirect }) => {
  return redirect(LinksData.find((l) => l.id === Links.donate)!.url, StatusCodes.PERMANENT_REDIRECT);
};
