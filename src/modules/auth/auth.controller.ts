import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { authService } from "./auth.service";
import type { LoginBody, SignupBody } from "./auth.types";

export const authController = (fastify: FastifyInstance) => {
	const authServiceInst = authService(fastify);

	return {
		signup: async (
			request: FastifyRequest<{ Body: SignupBody }>,
			reply: FastifyReply,
		) => {
			try {
				const { email, name, password } = request.body;
				const user = await authServiceInst.signup(email, name, password);

				const token = fastify.jwt.sign(
					{ id: user.id, email: user.email },
					{ expiresIn: "1h" },
				);

				reply
					.setCookie("token", token, {
						httpOnly: true,
						sameSite: "strict",
						path: "/",
						maxAge: 3600,
					})
					.send({ user: { id: user.id, email: user.email, name: user.name } });
			} catch (err: unknown) {
				if (err instanceof Error)
					reply.status(401).send({ error: err.message });
				else reply.status(401).send({ error: "Unknown error" });
			}
		},

		login: async (
			request: FastifyRequest<{ Body: LoginBody }>,
			reply: FastifyReply,
		) => {
			try {
				const { email, password } = request.body;
				const user = await authServiceInst.login(email, password);

				const token = fastify.jwt.sign({ id: user.id, email: user.email });

				reply
					.setCookie("token", token, {
						httpOnly: true,
						sameSite: "strict",
						path: "/",
						maxAge: 3600,
					})
					.send({ user: { id: user.id, email: user.email, name: user.name } });
			} catch (err: unknown) {
				if (err instanceof Error)
					reply.status(400).send({ error: err.message });
				else reply.status(400).send({ error: "Unknown error" });
			}
		},

		logout: async (_request: FastifyRequest, reply: FastifyReply) => {
			reply.clearCookie("token", { path: "/" }).send({ message: "Logged out" });
		},
	};
};
