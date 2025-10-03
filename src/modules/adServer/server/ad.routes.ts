import type { FastifyInstance } from "fastify";
import { adSchema } from "./ad.schema";
import adService from "./ad.service";

const adServerRoutes = async (fastify: FastifyInstance) => {
	fastify.post("/", { schema: adSchema }, adService.serve);
};

export default adServerRoutes;
