import "fastify";
import type Client from "@clickhouse/client";
import type { FastifyReply, FastifyRequest } from "fastify";

declare module "fastify" {
	interface FastifyInstance {
		jwtAuth: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
		prisma: PrismaClient;
		config: {
			DATABASE_URL: string;
			MONGO_INITDB_DATABASE: string;
			CLICKHOUSE_DB: string;
			CLICKHOUSE_USER: string;
			CLICKHOUSE_PASSWORD: string;
			CLICKHOUSE_HOST: string;
			CLICKHOUSE_PORT: number;
			JWT_SECRET: string;
			COOKIE_SECRET: string;
			DEFAULT_FEED_URL: string;
			CORS_ORIGIN: string;
			CORS_LOCAL: string;
			PORT: number;
			HOST: string;
			CRON_SCHEDULE: string;
		};
		ch: Client;
	}
	interface FastifyReply {
		sendWithToken: (token: string, payload: object) => FastifyReply;
		sendError: (err: unknown, status?: number) => FastifyReply;
		sendMessage: (message: unknown, status?: number) => FastifyReply;
	}
}
