// src/modules/article/article.controller.ts
import type { FastifyReply, FastifyRequest } from "fastify";
import { articleService } from "./article.service";

interface GetArticleQuery {
	guid: string;
}

export const articleController = {
	getArticle: async (
		request: FastifyRequest<{ Querystring: GetArticleQuery }>,
		reply: FastifyReply,
	) => {
		const { guid } = request.query;
		if (!guid) return reply.status(400).send({ error: "URL is required" });

		try {
			const article = await articleService.parseArticle(guid);
			return reply.send(article);
		} catch (err) {
			request.log.error(err);
			return reply.status(500).send({ error: "Failed to parse article" });
		}
	},
};
