import type { FastifyReply, FastifyRequest } from "fastify";
import { Filters } from "./ad.filters";

type AdRequestBody = {
	userId: string;
};

const servedAds = new Map<string, Set<number>>();
export const adController = {
	serve: async (request: FastifyRequest, reply: FastifyReply) => {
		const body = request.body as AdRequestBody;
		const { userId } = body;

		let lineItems = await request.server.prisma.lineItem.findMany();

		lineItems = Filters.applyAll(lineItems, request, servedAds);
		if (!lineItems.length) {
			return reply.send({ ok: false, message: "No matching line item" });
		}

		const chosen = lineItems[0];

		if (!servedAds.has(userId)) servedAds.set(userId, new Set());
		servedAds.get(userId)?.add(chosen.id);

		reply.send({
			ok: true,
			lineItem: chosen,
		});
	},
};

export default adController;
