import type { FastifyReply, FastifyRequest } from "fastify";
import { Filters } from "./ad.filters";
import type { LineItemFilterBody } from "./ad.schema";

export const adService = {
	serve: async (
		request: FastifyRequest<{ Body: LineItemFilterBody }>,
		reply: FastifyReply,
	) => {
		let userId = "unauthorized";

		try {
			const bidId = request.body.bidId;
			const token = request.cookies.token;

			if (token) {
				try {
					const payload = await request.server.jwt.verify<{ id: string }>(
						token,
					);
					userId = payload.id;
				} catch {}
			}

			let lineItems = await request.server.prisma.lineItem.findMany();
			const servedAds = new Map<string, Set<number>>();

			lineItems = Filters.applyAll(lineItems, request, servedAds, userId);

			if (!lineItems.length) {
				return reply.notFound("No ads available");
			}

			const chosen = lineItems[0];

			if (userId !== "unauthorized") {
				if (!servedAds.has(userId)) servedAds.set(userId, new Set());
				servedAds.get(userId)?.add(chosen.id);
			}

			const [width, height] = chosen.size.split("x").map(Number);

			const bids = [
				{
					bidId: bidId,
					cpm: chosen.minCpm,
					width,
					height,
					ad: `<img src="http://localhost:3000${chosen.creativeUrl}" width="${width}" height="${height}" />`,
					creativeId: chosen.id,
					currency: "USD",
					ttl: 300,
				},
			];

			reply.type("application/json; charset=utf-8").send({ bids });
		} catch (error) {
			return reply.internalServerError(
				error instanceof Error ? error.message : String(error),
			);
		}
	},
};

export default adService;
