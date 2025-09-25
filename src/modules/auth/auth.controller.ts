import type { FastifyReply, FastifyRequest } from "fastify";
import type { AuthService } from "./auth.service";
import type { LoginBody, SignupBody } from "./auth.types";

export class AuthController {
	constructor(
		private authService: AuthService,
		private jwt: any,
	) {}

	async signup(
		request: FastifyRequest<{ Body: SignupBody }>,
		reply: FastifyReply,
	) {
		try {
			const { email, name, password } = request.body;
			const user = await this.authService.signup(email, name, password);

			const token = this.jwt.sign(
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
		} catch (err: any) {
			reply.status(400).send({ error: err.message });
		}
	}

	async login(
		request: FastifyRequest<{ Body: LoginBody }>,
		reply: FastifyReply,
	) {
		try {
			const { email, password } = request.body;
			const user = await this.authService.login(email, password);

			const token = this.jwt.sign({ id: user.id, email: user.email });
			reply
				.setCookie("token", token, {
					httpOnly: true,
					sameSite: "strict",
					path: "/",
					maxAge: 3600,
				})
				.send({ user: { id: user.id, email: user.email, name: user.name } });
		} catch (err: any) {
			reply.status(401).send({ error: err.message });
		}
	}

	async logout(_request: FastifyRequest, reply: FastifyReply) {
		reply.clearCookie("token", { path: "/" }).send({ message: "Logged out" });
	}
}
