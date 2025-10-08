import type { FastifyInstance } from "fastify";
import { articleSchema } from "./article.schema";
import { articleService } from "./article.service";

const articleRoutes = async (fastify: FastifyInstance) => {
	fastify.get(
		"/getArticle",
		{ schema: articleSchema },
		articleService.getArticle,
	);
};

export default articleRoutes;
