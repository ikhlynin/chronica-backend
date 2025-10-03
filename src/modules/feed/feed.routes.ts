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
				return reply.send({ items });
			} catch (err) {
				console.error("Feed error:", err);
				return reply.internalServerError(err);
			}
		},
	);
};

export default feedRoutes;
