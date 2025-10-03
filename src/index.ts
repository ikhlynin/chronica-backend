import { join } from "node:path";
import AutoLoad from "@fastify/autoload";
import Fastify from "fastify";
import lineItemRoutes from "./modules/adServer/lineItem/line-item.routes";
import adServerRoutes from "./modules/adServer/server/ad.routes";
import articleRoutes from "./modules/article/article.routes";
import authRoutes from "./modules/auth/auth.routes";
import feedRoutes from "./modules/feed/feed.routes";
import metricRoutes from "./modules/metrics/metric.routes";
import configPlugin from "./shared/config/config.plugin";

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

async function start() {
	try {
		await app.register(configPlugin);

		await app.register(AutoLoad, {
			dir: join(__dirname, "shared/plugins"),
		});

		await app.register(authRoutes, { prefix: "/auth" });
		await app.register(feedRoutes, { prefix: "/feed" });
		await app.register(articleRoutes, { prefix: "/article" });
		await app.register(lineItemRoutes, { prefix: "/lineItem" });
		await app.register(adServerRoutes, { prefix: "/adServer" });
		await app.register(metricRoutes, { prefix: "/metrics" });

		await app.listen({ port: app.config.PORT, host: app.config.HOST });
		console.log(`Server started at ${app.config.HOST}:${app.config.PORT}`);
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
}

start();
