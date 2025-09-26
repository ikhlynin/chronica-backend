import type { FastifyInstance } from "fastify";
import { articleController } from "./article.controller";
import { articleSchema } from "./article.schema";

export const articleRoutes = async (fastify: FastifyInstance) => {
	fastify.get(
		"/getArticle",
		{ schema: articleSchema },
		articleController.getArticle,
	);
};
