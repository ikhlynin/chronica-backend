import type { FastifyInstance } from "fastify";
import { AuthController } from "./auth.controller";
import { loginSchema, signupSchema } from "./auth.schema";
import { AuthService } from "./auth.service";

export const authRoutes = async (fastify: FastifyInstance) => {
	const authService = new AuthService(fastify.prisma);
	const authController = new AuthController(authService, fastify.jwt);

	fastify.post(
		"/signup",
		{ schema: signupSchema },
		authController.signup.bind(authController),
	);
	fastify.post(
		"/login",
		{ schema: loginSchema },
		authController.login.bind(authController),
	);
	fastify.post("/logout", authController.logout.bind(authController));
};
