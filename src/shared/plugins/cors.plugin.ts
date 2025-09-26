import fastifyCors from "@fastify/cors";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

const corsPlugin = fp(async (fastify: FastifyInstance) => {
	fastify.register(fastifyCors, {
		origin: ["http://localhost:5173", "https://chronica-frontend.vercel.app"],
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	});
});

export default corsPlugin;
