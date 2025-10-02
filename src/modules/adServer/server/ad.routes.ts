import type { FastifyInstance } from "fastify";
import adController from "./ad.controller";
import { adSchema } from "./ad.schema";

const adServerRoutes = async (fastify: FastifyInstance) => {
	fastify.post("/", { schema: adSchema }, adController.serve);
};

export default adServerRoutes;
