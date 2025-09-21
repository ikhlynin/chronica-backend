import type { FastifyInstance } from "fastify";
import { authController } from "../controller/auth.controller";

export const authRoutes = async (fastify: FastifyInstance) => {
	fastify.post("/signup", authController.signup);
	fastify.post("/login", authController.login);
	fastify.post("/logout", authController.logout);
};
