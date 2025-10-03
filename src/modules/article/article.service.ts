import * as cheerio from "cheerio";
import type { FastifyReply, FastifyRequest } from "fastify";

interface GetArticleQuery {
	guid?: string;
}

export const articleService = {
	getArticle: async (
		request: FastifyRequest<{ Querystring: GetArticleQuery }>,
		reply: FastifyReply,
	) => {
		const { guid } = request.query;
		if (!guid) return reply.badRequest("Missing guid");

		try {
			const res = await fetch(guid, {
				headers: {
					"User-Agent":
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
					"Accept-Language": "en-US,en;q=0.9",
				},
			});
			if (!res.ok) throw new Error("Failed to fetch article HTML");

			const html = await res.text();
			const $ = cheerio.load(html);

			const article = {
				title: $("h1, h2, .title").first().text().trim(),
				image:
					$("meta[property='og:image']").attr("content") ||
					$("meta[name='twitter:image']").attr("content") ||
					"",
				content: $("p, .content, .description")
					.map((_, el) => $(el).text().trim())
					.get()
					.join("\n\n"),
				url: guid,
				creator: $("meta[name='author']").attr("content") || undefined,
				pubDate:
					$("meta[property='article:published_time']").attr("content") ||
					undefined,
			};

			return reply.send({ ok: true, article });
		} catch (err) {
			return reply.internalServerError(err);
		}
	},
};
