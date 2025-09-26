import env from "@fastify/env";
import fp from "fastify-plugin";
import { envSchema } from "../schemas/env.schema";

const envPlugin = fp(async (fastify) => {
	await fastify.register(env, {
		dotenv: true,
		schema: envSchema,
	});
});

export default envPlugin;
