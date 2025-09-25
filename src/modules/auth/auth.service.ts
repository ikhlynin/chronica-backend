import type { PrismaClient } from "@prisma/client";
import { comparePassword, hashPassword } from "../../shared/utils/hash";

export class AuthService {
	constructor(private prisma: PrismaClient) {}

	async signup(email: string, name: string, password: string) {
		const isUserExist = await this.prisma.user.findUnique({ where: { email } });
		if (isUserExist) throw new Error("User already exists");

		const hashed = await hashPassword(password.trim());
		const user = await this.prisma.user.create({
			data: { email, name, password: hashed },
		});

		return user;
	}

	async login(email: string, password: string) {
		const user = await this.prisma.user.findUnique({ where: { email } });
		if (!user) throw new Error("User not found");

		const valid = await comparePassword(password.trim(), user.password);
		if (!valid) throw new Error("Password don't match");

		return user;
	}
}
