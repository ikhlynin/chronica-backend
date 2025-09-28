import fastifyEnv from "@fastify/env";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { configSchema } from "../schemas/config.schema";

const configPlugin = fp(async (fastify: FastifyInstance) => {
	await fastify.register(fastifyEnv, {
		dotenv: true,
		schema: configSchema,
	});
});

export default configPlugin;
