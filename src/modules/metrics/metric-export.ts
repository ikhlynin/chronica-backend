import ExcelJS from "exceljs";
import { format } from "fast-csv";
import type { FastifyInstance } from "fastify";

interface ExportCsvBody {
	query: string;
}

type ClickHouseRow = Record<string, string | number | boolean | null>;

export default async function exportRoutes(fastify: FastifyInstance) {
	fastify.post<{ Body: ExportCsvBody }>(
		"/metrics/export/csv",
		async (request, reply) => {
			const { query } = request.body;

			const result: { data: ClickHouseRow[] } = await fastify.ch.query({
				query,
				format: "JSON",
			});

			reply.header("Content-Type", "text/csv");
			reply.header("Content-Disposition", "attachment; filename=metrics.csv");

			const csvStream = format({ headers: true });
			csvStream.pipe(reply.raw);

			for (const row of result.data) {
				csvStream.write(row);
			}

			csvStream.end();
		},
	);
	fastify.post<{ Body: ExportCsvBody }>(
		"/metrics/export/excel",
		async (request, reply) => {
			const { query } = request.body;

			const result: { data: ClickHouseRow[] } = await fastify.ch.query({
				query,
				format: "JSON",
			});

			const workbook = new ExcelJS.Workbook();
			const worksheet = workbook.addWorksheet("Metrics");

			if (result.data.length > 0) {
				worksheet.columns = Object.keys(result.data[0]).map((key) => ({
					header: key,
					key,
				}));
				worksheet.addRows(result.data);
			}

			reply.header("Content-Disposition", "attachment; filename=metrics.xlsx");
			reply.header(
				"Content-Type",
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			);

			await workbook.xlsx.write(reply.raw);
			reply.raw.end();
		},
	);
}
