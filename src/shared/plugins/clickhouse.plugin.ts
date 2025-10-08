import { createClient } from "@clickhouse/client";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

const clickhousePlugin = fp(async (fastify: FastifyInstance) => {
	const {
		CLICKHOUSE_HOST,
		CLICKHOUSE_USER,
		CLICKHOUSE_PASSWORD,
		CLICKHOUSE_DB,
		CLICKHOUSE_PORT,
	} = fastify.config;

	const chClient = createClient({
		url: `${CLICKHOUSE_HOST}:${CLICKHOUSE_PORT}`,
		username: CLICKHOUSE_USER,
		password: CLICKHOUSE_PASSWORD,
		database: CLICKHOUSE_DB,
	});

	fastify.decorate("ch", chClient);

	await chClient.query({
		query: `
		CREATE TABLE IF NOT EXISTS metrics
		(
    		event String,
    		timestamp DateTime,
    		pageUrl String,
    		adapter String,
    		adId String DEFAULT '',
    		creativeId String DEFAULT '',
    		cpm Float32 DEFAULT 0,
			userId String Default ''
			) ENGINE = MergeTree()
			ORDER BY timestamp;
		`,
	});

	fastify.addHook("onClose", async () => {
		await chClient.close();
	});
});

export default clickhousePlugin;
