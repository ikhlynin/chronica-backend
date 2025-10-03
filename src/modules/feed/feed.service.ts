import type { FastifyInstance } from "fastify";
import Parser from "rss-parser";
import normalizeFeedItems from "../../shared/utils/normalizeFeedItem";

const parser = new Parser();

const fetchFeed = async (
	server: FastifyInstance,
	url?: string,
	force = false,
) => {
	const feedUrl = url || server.config.DEFAULT_FEED_URL;
	if (!feedUrl) throw new Error("Default feed URL not defined");
	if (!feedUrl.endsWith(".rss") && !feedUrl.endsWith(".xml")) {
		throw new Error("Non-RSS feed not supported");
	}

	if (!force) {
		const cached = await server.prisma.feed.findUnique({
			where: { url: feedUrl },
		});
		if (cached) {
			return normalizeFeedItems(cached.items || []);
		}
	}

	const parsed = await parser.parseURL(feedUrl);
	const items = JSON.parse(JSON.stringify(parsed.items));

	if (force) {
		await server.prisma.feed.upsert({
			where: { url: feedUrl },
			update: { items },
			create: { url: feedUrl, items },
		});
	} else {
		await server.prisma.feed.create({ data: { url: feedUrl, items } });
	}

	const normalizedItems = normalizeFeedItems(parsed.items);
	return normalizedItems;
};

export default fetchFeed;
