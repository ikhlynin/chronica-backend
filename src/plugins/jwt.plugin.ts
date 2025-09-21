import fastifyJwt, { type FastifyJWTOptions } from "@fastify/jwt";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

const jwtPlugin = fp(async (fastify: FastifyInstance) => {
	const jwtSecret = process.env.JWT_SECRET;
	if (!jwtSecret) throw new Error("Jwt secret not found");
	fastify.register<FastifyJWTOptions>(fastifyJwt, {
		secret: jwtSecret,
	});

	fastify.decorate(
		"jwtAuth",
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				await request.jwtVerify();
			} catch {
				reply.status(401).send({ message: "Unathorize" });
			}
		},
	);
});

export default jwtPlugin;
