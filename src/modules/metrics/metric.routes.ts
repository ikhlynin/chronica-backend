import type { FastifyInstance } from "fastify";
import { initMetricCache, type MetricEvent } from "./metric.service";

export default async function metricRoutes(fastify: FastifyInstance) {
	const { addEvents } = initMetricCache(fastify);

	fastify.post("/", async (request, reply) => {
		const events = request.body as MetricEvent[];
		addEvents(events);
		reply.send({ status: "ok", added: events.length });
	});
}
