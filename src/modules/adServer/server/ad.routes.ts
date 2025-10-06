import type { FastifyInstance } from "fastify";
import { getBidsSchema } from "./ad.schema";
import adService from "./ad.service";

const adServerRoutes = async (fastify: FastifyInstance) => {
	fastify.post("/getBids", { schema: getBidsSchema }, adService.serve);
};

export default adServerRoutes;
