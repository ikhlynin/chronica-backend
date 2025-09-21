import type { FastifyInstance } from "fastify";
import { feedController } from "../controller/feed.controller";

export const feedRoutes = async (app: FastifyInstance) => {
	app.get("/feed", feedController.getFeed);
};
