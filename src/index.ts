import { join } from "node:path";
import AutoLoad from "@fastify/autoload";
import Fastify from "fastify";
import { authRoutes } from "./routes/auth.routes";
import { feedRoutes } from "./routes/feed.routes";

const PORT = 3000;

const app = Fastify({
	logger: {
		transport: {
			target: "pino-pretty",
			options: {
				colorize: true,
				translateTime: "HH:MM:ss",
				ignore: "pid,hostname,reqId",
				singleLine: true,
			},
		},
	},
});

app.register(AutoLoad, { dir: join(__dirname, "plugins") });

app.register(authRoutes, { prefix: "/auth" });
app.register(feedRoutes);

app.listen({ port: PORT }, (err, adress) => {
	if (err) {
		app.log.error(err);
		process.exit(1);
	}
	console.log(`Server started at port ${PORT}`);
});
