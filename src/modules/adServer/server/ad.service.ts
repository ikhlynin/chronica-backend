import type { FastifyReply, FastifyRequest } from "fastify";
import { Filters } from "./ad.filters";
import type { LineItemFilterBody } from "./ad.schema";

export const adService = {
	serve: async (
		request: FastifyRequest<{ Body: LineItemFilterBody }>,
		reply: FastifyReply,
	) => {
		try {
			const { userId } = request.body;

			let lineItems = await request.server.prisma.lineItem.findMany();
			const servedAds = new Map<string, Set<number>>();

			lineItems = Filters.applyAll(lineItems, request, servedAds);

			if (!lineItems.length) {
				return reply.notFound("No ads available");
			}

			const chosen = lineItems[0];

			if (userId) {
				if (!servedAds.has(userId)) servedAds.set(userId, new Set());
				servedAds.get(userId)?.add(chosen.id);
			}

			reply.send({
				ok: true,
				lineItem: chosen,
			});
		} catch (error) {
			return reply.internalServerError(error);
		}
	},
};

export default adService;
