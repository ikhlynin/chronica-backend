import type { FastifyInstance } from "fastify";
import { loginSchema, logoutSchema, signupSchema } from "./auth.schema";
import { authService } from "./auth.service";

const authRoutes = async (fastify: FastifyInstance) => {
	const controller = authService(fastify);
	fastify.post("/signup", { schema: signupSchema }, controller.signup);
	fastify.post("/login", { schema: loginSchema }, controller.login);
	fastify.post("/logout", { schema: logoutSchema }, controller.logout);
};

export default authRoutes;
