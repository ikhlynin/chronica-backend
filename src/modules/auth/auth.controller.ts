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

				return reply.sendWithToken(token, { user });
			} catch (err: unknown) {
				return reply.sendError(err, 401);
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

				return reply.sendWithToken(token, { user });
			} catch (err: unknown) {
				return reply.sendError(err, 401);
			}
		},

		logout: async (_request: FastifyRequest, reply: FastifyReply) => {
			reply.clearCookie("token", { path: "/" });
			return reply.sendMessage("Logged out");
		},
	};
};
