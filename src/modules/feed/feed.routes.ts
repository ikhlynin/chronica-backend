import type { FastifyInstance } from "fastify";
import { feedController } from "./feed.controller";
import { FeedSchema } from "./feed.schema";

export const feedRoutes = async (fastify: FastifyInstance) => {
	fastify.get("/getFeed", { schema: FeedSchema }, feedController.getFeed);
};
