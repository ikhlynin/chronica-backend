import "fastify";
import type { FastifyReply, FastifyRequest } from "fastify";

declare module "fastify" {
	interface FastifyInstance {
		jwtAuth: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
		prisma: PrismaClient;
		config: { PORT: number; JWT_SECRET: string };
	}
	interface FastifyReply {
		sendWithToken: (token: string, payload: object) => FastifyReply;
		sendError: (err: unknown, status?: number) => FastifyReply;
		sendMessage: (message: unknown, status?: number) => FastifyReply;
	}
}
