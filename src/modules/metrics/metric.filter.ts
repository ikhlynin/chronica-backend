import type { FastifyInstance } from "fastify";

interface MetricFilterBody {
	slice?: string;
	sliceName?: string;
	minValue?: number;
	maxValue?: number;
	page?: number;
	limit?: number;
}

export default async function filterRoutes(fastify: FastifyInstance) {
	fastify.post("/metrics/filter", async (request, reply) => {
		const {
			slice,
			sliceName,
			minValue,
			maxValue,
			page = 1,
			limit = 50,
		} = request.body as MetricFilterBody;

		const conditions: string[] = [];
		if (slice) conditions.push(`slice = '${slice}'`);
		if (sliceName) conditions.push(`slice_name = '${sliceName}'`);
		if (minValue !== undefined) conditions.push(`value >= ${minValue}`);
		if (maxValue !== undefined) conditions.push(`value <= ${maxValue}`);

		const query = `
      SELECT * FROM metrics
      ${conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${(page - 1) * limit}
    `;

		const result = await fastify.ch.query({ query, format: "JSON" });
		reply.send(result);
	});
}
