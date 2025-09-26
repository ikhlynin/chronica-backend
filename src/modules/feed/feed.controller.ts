import type { FastifyReply, FastifyRequest } from "fastify";
import { feedService } from "./feed.service";
import type { GetFeedQuery } from "./feed.types";

export const feedController = {
	getFeed: async (
		request: FastifyRequest<{ Querystring: GetFeedQuery }>,
		reply: FastifyReply,
	) => {
		const { url, force } = request.query;
		const feedUrl = url || process.env.DEFAULT_FEED_URL;
		if (!feedUrl)
			return reply.status(400).send({ error: "Default feed URL not defined" });

		try {
			const forceFetch = force === "1";
			if (forceFetch) {
				const items = await feedService.parseFeed(feedUrl);
				await request.server.prisma.feed.upsert({
					where: { url: feedUrl },
					update: { items },
					create: { url: feedUrl, items },
				});
				return reply.send({ items });
			}

			const cached = await request.server.prisma.feed.findUnique({
				where: { url: feedUrl },
			});
			if (cached) return reply.send({ items: cached.items });

			const items = await feedService.parseFeed(feedUrl);
			await request.server.prisma.feed.create({
				data: { url: feedUrl, items },
			});
			return reply.send({ items });
		} catch (err) {
			request.log.error(err);
			return reply.status(500).send({ error: "Failed to fetch feed" });
		}
	},
};
