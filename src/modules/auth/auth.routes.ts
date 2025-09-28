import type { FastifyInstance } from "fastify";
import { authController } from "./auth.controller";
import { loginSchema, logoutSchema, signupSchema } from "./auth.schema";

export const authRoutes = async (fastify: FastifyInstance) => {
	const controller = authController(fastify);
	fastify.post("/signup", { schema: signupSchema }, controller.signup);
	fastify.post("/login", { schema: loginSchema }, controller.login);
	fastify.post("/logout", { schema: logoutSchema }, controller.logout);
};
