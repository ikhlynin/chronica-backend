import path from "node:path";
import fastifyStatic from "@fastify/static";
import fp from "fastify-plugin";

const staticPlugin = fp(async (fastify) => {
	fastify.register(fastifyStatic, {
		root: path.join(process.cwd(), "public"),
		prefix: "/public/",
	});
});

export default staticPlugin;
