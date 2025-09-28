import type { FastifyReply, FastifyRequest } from "fastify";
import { feedService } from "./feed.service";
import type { GetFeedQuery } from "./feed.types";

export const feedController = {
	getFeed: async (
		request: FastifyRequest<{ Querystring: GetFeedQuery }>,
		reply: FastifyReply,
	) => {
		const { url, force } = request.query;
		const feedUrl = url || request.server.config.DEFAULT_FEED_URL;
		if (!feedUrl) {
			const err = "Default feed URL not defined";
			return reply.sendError(err, 400);
		}

		try {
			const forceFetch = force === "1";
			if (forceFetch) {
				const items = await feedService.parseFeed(feedUrl);
				await request.server.prisma.feed.upsert({
					where: { url: feedUrl },
					update: { items },
					create: { url: feedUrl, items },
				});
				return reply.sendMessage(items);
			}

			const cached = await request.server.prisma.feed.findUnique({
				where: { url: feedUrl },
			});
			if (cached) return reply.send({ items: cached.items });

			const items = await feedService.parseFeed(feedUrl);
			await request.server.prisma.feed.create({
				data: { url: feedUrl, items },
			});
			return reply.sendMessage(items);
		} catch (err) {
			return reply.sendError(err, 500);
		}
	},
};
