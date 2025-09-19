import { PrismaClient } from "@prisma/client";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

const prismaPlugin = fp(async (fastify: FastifyInstance) => {
	const prisma = new PrismaClient();
	await prisma.$connect();
	fastify.decorate("prisma", prisma);

	fastify.addHook("onClose", async (app) => {
		await app.prisma.$disconnect();
	});
});

declare module "fastify" {
	interface FastifyInstance {
		prisma: PrismaClient;
	}
}

export default prismaPlugin;
