import { createClient } from "@clickhouse/client";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

const clickhousePlugin = fp(async (fastify: FastifyInstance) => {
	const {
		CLICKHOUSE_HOST,
		CLICKHOUSE_USER,
		CLICKHOUSE_PASSWORD,
		CLICKHOUSE_DB,
	} = fastify.config;

	const url = `http://${CLICKHOUSE_USER}:${CLICKHOUSE_PASSWORD}@${CLICKHOUSE_HOST}/${CLICKHOUSE_DB}`;

	const chClient = createClient({ url });

	fastify.decorate("ch", chClient);

	fastify.addHook("onClose", async () => {
		await chClient.close();
	});
});

export default clickhousePlugin;
