import type { FastifyInstance } from "fastify";
import { FeedSchema } from "./feed.schema";
import fetchFeed from "./feed.service";

interface GetFeedQuery {
	url?: string;
	force?: string;
}

const feedRoutes = async (fastify: FastifyInstance) => {
	fastify.get<{ Querystring: GetFeedQuery }>(
		"/getFeed",
		{ schema: FeedSchema },
		async (request, reply) => {
			try {
				const { url, force } = request.query;
				const items = await fetchFeed(request.server, url, force === "1");
				const normalizedItems = items.map((item) => ({
					title: item.title ?? "",
					link: item.link ?? "",
					guid: item.guid ?? "",
					content: item.content ?? "",
					contentSnippet: item.contentSnippet ?? item.content ?? "",
					isoDate: item.isoDate ?? "",
					image: item.image ?? "",
				}));
				return reply.send({ items: normalizedItems });
			} catch (err) {
				console.error("Feed error:", err);
				return reply.internalServerError(err);
			}
		},
	);
};

export default feedRoutes;
