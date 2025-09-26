import { join } from "node:path";
import AutoLoad from "@fastify/autoload";
import Fastify from "fastify";
import { articleRoutes } from "./modules/article/article.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { feedRoutes } from "./modules/feed/feed.routes";

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

app.register(AutoLoad, {
	dir: join(__dirname, "shared/plugins"),
});

app.register(authRoutes, { prefix: "/auth" });
app.register(feedRoutes, { prefix: "/feed" });
app.register(articleRoutes, { prefix: "/article" });

app.listen({ port: PORT }, (err, _adress) => {
	if (err) {
		app.log.error(err);
		process.exit(1);
	}
	console.log(`Server started at port ${PORT}`);
});
