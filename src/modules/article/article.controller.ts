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
			return reply.sendMessage(article);
		} catch (err) {
			return reply.sendError(err, 500);
		}
	},
};
