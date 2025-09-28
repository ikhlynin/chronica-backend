import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

const healthPlugin = fp(async (fastify: FastifyInstance) => {
	fastify.get("/health/server", async () => ({
		status: "ok",
		service: "server",
	}));

	fastify.get("/health/db", async () => {
		try {
			await fastify.prisma.$runCommandRaw({ ping: 1 });
			return { status: "ok", service: "database" };
		} catch (error) {
			fastify.log.error(error);
			return { status: "error", service: "database" };
		}
	});
});

export default healthPlugin;
