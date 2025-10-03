import type { FastifyInstance } from "fastify";
import fastifyCron from "fastify-cron";
import fp from "fastify-plugin";
import fetchFeed from "../../modules/feed/feed.service";

const cronPlugin = fp(async (fastify: FastifyInstance) => {
	const cronTime = fastify.config.CRON_SCHEDULE;

	fastify.register(fastifyCron, {
		jobs: [
			{
				cronTime: cronTime,
				onTick: async () => {
					try {
						const items = await fetchFeed(fastify, undefined, true);

						fastify.log.info(
							{ count: items.length },
							"[CRON] Feed successfully refreshed",
						);
					} catch (err) {
						fastify.log.error({ err }, "[CRON] Failed to refresh feed");
					}
				},
			},
		],
	});
});
export default cronPlugin;
