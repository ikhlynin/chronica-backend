import type { FastifyReply, FastifyRequest } from "fastify";
import Parser from "rss-parser";

const parser = new Parser();

export const feedController = {
	getFeed: async (request: FastifyRequest, reply: FastifyReply) => {
		const { url, force } = request.query as { url?: string; force?: string };

		const feedUrl = url || process.env.DEFAULT_FEED_URL;
		if (!feedUrl) throw new Error("Default feed url not defined and");
		const forceFetch = force === "1";

		try {
			if (forceFetch) {
				const parsed = await parser.parseURL(feedUrl);
				const items = JSON.parse(JSON.stringify(parsed.items));
				await request.server.prisma.feed.upsert({
					where: { url: feedUrl },
					update: { items: parsed.items },
					create: { url: feedUrl, items },
				});
				return reply.send({ items: parsed.items });
			}

			const cached = await request.server.prisma.feed.findUnique({
				where: { url: feedUrl },
			});

			if (cached) {
				return reply.send({ items: cached.items });
			}
			const parsed = await parser.parseURL(feedUrl);
			const items = JSON.parse(JSON.stringify(parsed.items));
			await request.server.prisma.feed.create({
				data: { url: feedUrl, items },
			});

			return reply.send({ items: parsed.items });
		} catch (err) {
			request.log.error(err);
			return reply.status(500).send({ error: "Failed to fetch feed" });
		}
	},
};
