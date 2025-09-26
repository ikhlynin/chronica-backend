import type { FastifyInstance, FastifyReply } from "fastify";
import fp from "fastify-plugin";

const replyPlugin = fp(async (fastify: FastifyInstance) => {
	fastify.decorateReply(
		"sendWithToken",
		function (this: FastifyReply, token: string, payload: object) {
			return this.setCookie("token", token, {
				httpOnly: true,
				sameSite: "strict",
				path: "/",
				maxAge: 3600,
			}).send(payload);
		},
	);
	fastify.decorateReply(
		"sendError",
		function (this: FastifyReply, err: unknown, status = 400) {
			const message = err instanceof Error ? err.message : "Unknown error";
			return this.status(status).send({ error: message });
		},
	);
	fastify.decorateReply(
		"sendMessage",
		function (this: FastifyReply, payload: unknown, status = 200) {
			return this.status(status).send(payload);
		},
	);
});

export default replyPlugin;
