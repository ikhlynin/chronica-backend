import type { FastifyInstance } from "fastify";
import { articleController } from "./article.controller";

export const articleRoutes = async (fastify: FastifyInstance) => {
	fastify.get("/getArticle", articleController.getArticle);
};
