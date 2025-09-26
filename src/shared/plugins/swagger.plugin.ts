import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

const fastifyPlugin = fp(async (fastify: FastifyInstance) => {
	await fastify.register(swagger, {
		swagger: {
			info: {
				title: "Chronica API",
				description: "Документация для Chronica backend",
				version: "1.0.0",
			},
			schemes: ["http", "https"],
			consumes: ["application/json"],
			produces: ["application/json"],
		},
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
