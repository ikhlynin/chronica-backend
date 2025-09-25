import Parser from "rss-parser";

const parser = new Parser();

export const feedService = {
	parseRss: async (url: string) => {
		const parsed = await parser.parseURL(url);
		return JSON.parse(JSON.stringify(parsed.items));
	},

	parseFeed: async (url: string) => {
		if (url.endsWith(".rss") || url.endsWith(".xml")) {
			return feedService.parseRss(url);
		}
		throw new Error("Non-RSS feed not supported in FeedService");
	},
};
