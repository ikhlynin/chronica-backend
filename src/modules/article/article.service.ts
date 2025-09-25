import * as cheerio from "cheerio";

export const articleService = {
	parseArticle: async (url: string) => {
		const res = await fetch(url, {
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
				"Accept-Language": "en-US,en;q=0.9",
			},
		});
		if (!res.ok) throw new Error("Failed to fetch article HTML");

		const html = await res.text();
		const $ = cheerio.load(html);
		return {
			title: $("h1, h2, .title").first().text().trim(),
			image:
				$("meta[property='og:image']").attr("content") ||
				$("meta[name='twitter:image']").attr("content") ||
				"",
			content: $("p, .content, .description")
				.map((_, el) => $(el).text().trim())
				.get()
				.join("\n\n"),
			url,
			creator: $("meta[name='author']").attr("content") || undefined,
			pubDate:
				$("meta[property='article:published_time']").attr("content") ||
				undefined,
		};
	},
};
