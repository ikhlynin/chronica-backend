import type { FastifyInstance } from "fastify";
import { comparePassword, hashPassword } from "../../shared/utils/hash";

export const authService = (fastify: FastifyInstance) => ({
	signup: async (email: string, name: string, password: string) => {
		const isUserExist = await fastify.prisma.user.findUnique({
			where: { email },
		});
		if (isUserExist) throw new Error("User already exists");

		const hashed = await hashPassword(password.trim());
		const user = await fastify.prisma.user.create({
			data: { email, name, password: hashed },
		});

		return user;
	},

	login: async (email: string, password: string) => {
		const user = await fastify.prisma.user.findUnique({ where: { email } });
		if (!user) throw new Error("User not found");

		const valid = await comparePassword(password.trim(), user.password);
		if (!valid) throw new Error("Password don't match");

		return user;
	},
});
