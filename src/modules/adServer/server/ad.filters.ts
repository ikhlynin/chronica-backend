import type { FastifyRequest } from "fastify";

export interface LineItem {
	id: number;
	size: string;
	geo: string;
	minCpm: number;
	maxCpm: number;
	adType: string;
	frequencyCap: number;
	creativeUrl: string;
}

export const Filters = {
	size: (lineItems: LineItem[], request: FastifyRequest) => {
		const { size } = request.body as { size?: string };
		if (!size) return lineItems;
		return lineItems.filter((li) => li.size === size);
	},

	geo: (lineItems: LineItem[], request: FastifyRequest) => {
		const { geo } = request.body as { geo?: string };
		if (!geo) return lineItems;
		return lineItems.filter((li) => li.geo === geo);
	},

	cpm: (lineItems: LineItem[], request: FastifyRequest) => {
		const { cpm } = request.body as { cpm?: number };
		if (cpm === undefined) return lineItems;
		return lineItems.filter((li) => li.minCpm <= cpm && li.maxCpm >= cpm);
	},

	frequencyCap: (
		lineItems: LineItem[],
		request: FastifyRequest,
		served = new Map<string, Set<number>>(),
	) => {
		const { userId } = request.body as { userId?: string };
		if (!userId) return lineItems;

		const userServed = served.get(userId) || new Set<number>();
		return lineItems.filter((li) => !userServed.has(li.id));
	},

	applyAll: (
		lineItems: LineItem[],
		request: FastifyRequest,
		served = new Map<string, Set<number>>(),
	) => {
		return Filters.frequencyCap(
			Filters.cpm(
				Filters.geo(Filters.size(lineItems, request), request),
				request,
			),
			request,
			served,
		);
	},
};
