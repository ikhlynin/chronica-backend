import cookie, { type FastifyCookieOptions } from "@fastify/cookie";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

const cookiePlugin = fp(async (fastify: FastifyInstance) => {
	const cookieSecret = process.env.COOKIE_SECRET || "secret";
	if (!cookieSecret) throw new Error("Cookie secret not found");
	fastify.register<FastifyCookieOptions>(cookie, {
		secret: cookieSecret,
		parseOptions: {},
	});
});

export default cookiePlugin;
