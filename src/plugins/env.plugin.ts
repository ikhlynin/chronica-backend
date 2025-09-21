import env from "@fastify/env";
import fp from "fastify-plugin";

const schema = {
	type: "object",
	required: ["PORT", "JWT_SECRET"],
	properties: {
		PORT: { type: "number", default: 3000 },
		JWT_SECRET: { type: "string" },
	},
};

const envPlugin = fp(async (fastify) => {
	await fastify.register(env, {
		dotenv: true,
		schema,
	});
});

export default envPlugin;
