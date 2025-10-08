import sensible from "@fastify/sensible";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

const replyPlugin = fp(async (fastify: FastifyInstance) => {
	await fastify.register(sensible);
});

export default replyPlugin;
