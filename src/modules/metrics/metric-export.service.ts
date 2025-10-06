import ExcelJS from "exceljs";
import { format } from "fast-csv";
import type { FastifyInstance } from "fastify";
import type { MetricEvent } from "./metric.types";

export class MetricExportService {
	private fastify: FastifyInstance;

	constructor(fastify: FastifyInstance) {
		this.fastify = fastify;
	}

	async fetchAllMetrics(): Promise<MetricEvent[]> {
		const result = await this.fastify.ch.query({
			query: `SELECT * FROM metrics ORDER BY timestamp DESC`,
			format: "JSON",
		});
		console.log("res; ", result);
		const raw = await result.json<{ data: MetricEvent[] }>();
		return raw.data;
	}

	async exportCsv(): Promise<Buffer> {
		const data = await this.fetchAllMetrics();
		const csvStream = format({ headers: true });
		const chunks: Buffer[] = [];

		return new Promise((resolve, reject) => {
			csvStream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
			csvStream.on("end", () => resolve(Buffer.concat(chunks)));
			csvStream.on("error", reject);

			for (const row of data) {
				csvStream.write({
					event: row.event,
					timestamp: row.timestamp,
					pageUrl: row.pageUrl,
					adapter: row.adapter ?? "",
					adId: row.adId ?? "",
					creativeId: row.creativeId ?? "",
					cpm: row.cpm ?? "",
					userId: row.userId ?? "",
				});
			}

			csvStream.end();
		});
	}

	async exportExcel(): Promise<Buffer> {
		const data = await this.fetchAllMetrics();
		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet("Metrics");

		if (data.length > 0) {
			worksheet.columns = Object.keys(data[0]).map((key) => ({
				header: key,
				key,
			}));
			worksheet.addRows(data);
		}

		return (await workbook.xlsx.writeBuffer()) as unknown as Buffer;
	}
}
