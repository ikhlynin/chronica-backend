import "fastify";
import type { FastifyReply, FastifyRequest } from "fastify";

declare module "fastify" {
	interface FastifyInstance {
		jwtAuth: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
		prisma: PrismaClient;
		config: {
			DATABASE_URL: string;
			MONGO_INITDB_DATABASE: string;
			JWT_SECRET: string;
			COOKIE_SECRET: string;
			DEFAULT_FEED_URL: string;
			CORS_ORIGIN: string;
			CORS_LOCAL: string;
			PORT: string;
		};
	}
	interface FastifyReply {
		sendWithToken: (token: string, payload: object) => FastifyReply;
		sendError: (err: unknown, status?: number) => FastifyReply;
		sendMessage: (message: unknown, status?: number) => FastifyReply;
	}
}
