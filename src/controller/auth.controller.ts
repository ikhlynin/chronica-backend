import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { comparePassword, hashPassword } from "../utils/hash";

const signupSchema = z.object({
	email: z.email(),
	name: z.string().min(1),
	password: z.string().min(3),
});

const loginSchema = z.object({
	email: z.email(),
	password: z.string().min(3),
});

export const authController = {
	signup: async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const { email, name, password } = signupSchema.parse(request.body);
			const isUserExist = await request.server.prisma.user.findUnique({
				where: { email },
			});
			if (isUserExist) {
				return reply.status(400).send({ error: "User already exists" });
			}

			const hashed = await hashPassword(password.trim());

			const user = await request.server.prisma.user.create({
				data: { email, password: hashed, name },
			});

			const token = request.server.jwt.sign(
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
		} catch (err) {
			reply.status(500).send(err);
		}
	},

	login: async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const { email, password } = loginSchema.parse(request.body);
			const user = await request.server.prisma.user.findUnique({
				where: { email },
			});

			if (!user) return reply.status(401).send({ error: "User not fount" });

			const valid = await comparePassword(password.trim(), user.password);
			if (!valid)
				return reply.status(401).send({ error: "Password dont match" });

			const token = request.server.jwt.sign({ id: user.id, email: user.email });
			reply
				.setCookie("token", token, {
					httpOnly: true,
					sameSite: "strict",
					path: "/",
					maxAge: 3600,
				})
				.send({ user: { id: user.id, email: user.email, name: user.name } });
		} catch (err) {
			reply.status(500).send(err);
		}
	},

	logout: async (_request: FastifyRequest, reply: FastifyReply) => {
		reply.clearCookie("token", { path: "/" }).send({ message: "Logged out" });
	},
};
