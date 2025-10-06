import type { FastifyInstance } from "fastify";
import { MetricService } from "./metric.service";
import type { MetricEvent } from "./metric.types";
import { MetricExportService } from "./metric-export.service";

export default async function metricRoutes(fastify: FastifyInstance) {
	const metricService = new MetricService(fastify);

	fastify.post("/save", async (request, reply) => {
		const events = request.body as MetricEvent[];
		metricService.addEvents(events, request);
		reply.send({ status: "ok", added: events.length });
	});

	fastify.get("/fetch", async (request, reply) => {
		const {
			page = "1",
			limit = "100",
			events,
			adapters,
			creativeIds,
			date,
			hour,
		} = request.query as Record<string, string | undefined>;

		const pageNum = Math.max(1, parseInt(page, 10));
		const limitNum = Math.min(1000, parseInt(limit, 10));

		const parseArray = (str?: string) =>
			str
				?.split(",")
				.map((s) => s.trim())
				.filter(Boolean);

		try {
			const metrics = await metricService.fetchMetrics({
				page: pageNum,
				limit: limitNum,
				events: parseArray(events),
				adapters: parseArray(adapters),
				creativeIds: parseArray(creativeIds),
				date,
				hour: hour ? parseInt(hour, 10) : undefined,
			});
			return metrics;
		} catch (err) {
			fastify.log.error(err);
			return reply.internalServerError("Failed to fetch metrics");
		}
	});

	fastify.post("/export/csv", async (_request, reply) => {
		const exportService = new MetricExportService(fastify);
		try {
			const buffer = await exportService.exportCsv();
			reply
				.header("Content-Type", "text/csv")
				.header("Content-Disposition", "attachment; filename=metrics.csv")
				.send(buffer);
		} catch (err) {
			fastify.log.error(err);
			reply.internalServerError("Failed to export CSV");
		}
	});

	fastify.post("/export/excel", async (_request, reply) => {
		const exportService = new MetricExportService(fastify);
		try {
			const buffer = await exportService.exportExcel();
			reply
				.header("Content-Disposition", "attachment; filename=metrics.xlsx")
				.header(
					"Content-Type",
					"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
				)
				.send(buffer);
		} catch (err) {
			fastify.log.error(err);
			reply.internalServerError("Failed to export Excel");
		}
	});
}
