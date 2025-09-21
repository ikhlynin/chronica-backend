import "fastify";
import type { FastifyReply, FastifyRequest } from "fastify";

declare module "fastify" {
	interface FastifyInstance {
		jwtAuth: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
		prisma: PrismaClient;
	}
}
