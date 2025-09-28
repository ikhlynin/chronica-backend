import fastifyCors from "@fastify/cors";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

const corsPlugin = fp(async (fastify: FastifyInstance) => {
	fastify.register(fastifyCors, {
		origin: [fastify.config.CORS_LOCAL, fastify.config.CORS_ORIGIN].filter(
			Boolean,
		),
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	});
});

export default corsPlugin;
