import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { comparePassword, hashPassword } from "../../shared/utils/hash";

interface SignupBody {
	email: string;
	name: string;
	password: string;
}

interface LoginBody {
	email: string;
	password: string;
}

export const authService = (fastify: FastifyInstance) => {
	return {
		signup: async (
			request: FastifyRequest<{ Body: SignupBody }>,
			reply: FastifyReply,
		) => {
			try {
				const { email, name, password } = request.body;

				const existingUser = await fastify.prisma.user.findUnique({
					where: { email },
				});
				if (existingUser) {
					return reply.badRequest("User already exists");
				}

				const hashed = await hashPassword(password.trim());
				const user = await fastify.prisma.user.create({
					data: { email, name, password: hashed },
				});

				const token = fastify.jwt.sign(
					{ id: user.id, email: user.email },
					{ expiresIn: "1h" },
				);

				reply.setCookie("token", token, {
					httpOnly: true,
					sameSite: "strict",
					path: "/",
					maxAge: 3600,
				});

				return reply.send({ user });
			} catch (err) {
				return reply.internalServerError(err);
			}
		},

		login: async (
			request: FastifyRequest<{ Body: LoginBody }>,
			reply: FastifyReply,
		) => {
			try {
				const { email, password } = request.body;

				const user = await fastify.prisma.user.findUnique({
					where: { email },
				});
				if (!user) return reply.unauthorized("User not found");

				const valid = await comparePassword(password.trim(), user.password);
				if (!valid) return reply.unauthorized("Password don't match");

				const token = fastify.jwt.sign(
					{ id: user.id, email: user.email },
					{ expiresIn: "1h" },
				);

				reply.setCookie("token", token, {
					httpOnly: true,
					sameSite: "strict",
					path: "/",
					maxAge: 3600,
				});

				return reply.send({ user });
			} catch (err) {
				return reply.internalServerError(err);
			}
		},

		logout: async (_request: FastifyRequest, reply: FastifyReply) => {
			reply.clearCookie("token", { path: "/" });
			return reply.send({ message: "Logged out" });
		},
	};
};
