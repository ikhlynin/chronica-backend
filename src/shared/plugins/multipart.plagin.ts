import multipart from "@fastify/multipart";
import type { FastifyInstance } from "fastify";
import fs from "fastify-plugin";

const multipartPlugin = fs(async (fastify: FastifyInstance) => {
	fastify.register(multipart, {
		attachFieldsToBody: true,
		limits: {
			fileSize: 10 * 1024 * 1024,
		},
	});
});

export default multipartPlugin;
