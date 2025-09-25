import type { FastifyReply } from "fastify";
import fp from "fastify-plugin";

const responsePlugin = fp(async (fastify) => {
	fastify.decorateReply(
		"success",
		function (this: FastifyReply, data: unknown) {
			this.send({ success: true, data });
		},
	);

	fastify.decorateReply(
		"error",
		function (this: FastifyReply, message: string, status = 500) {
			this.status(status).send({ success: false, message });
		},
	);
});

export default responsePlugin;
