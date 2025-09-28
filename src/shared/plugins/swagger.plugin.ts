import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { swaggerSchema } from "../schemas/swagger.schema";

const fastifyPlugin = fp(async (fastify: FastifyInstance) => {
	await fastify.register(swagger, {
		swagger: swaggerSchema,
	});

	await fastify.register(swaggerUI, {
		routePrefix: "/docs",
		uiConfig: {
			docExpansion: "full",
			deepLinking: false,
		},
		staticCSP: true,
	});
});

export default fastifyPlugin;
