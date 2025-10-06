import type { FastifyRequest } from "fastify";
import type { LineItemFilterBody } from "./ad.schema";

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
	size: (
		lineItems: LineItem[],
		request: FastifyRequest<{ Body: LineItemFilterBody }>,
	) => {
		const { size } = request.body;
		if (!size) return lineItems;
		let sizeStr = "";
		if (Array.isArray(size)) {
			if (Array.isArray(size[0])) {
				sizeStr = size[0].join("x");
			} else {
				sizeStr = size.join("x");
			}
		} else {
			sizeStr = size;
		}
		return lineItems.filter((li) => li.size === sizeStr);
	},

	geo: (
		lineItems: LineItem[],
		request: FastifyRequest<{ Body: LineItemFilterBody }>,
	) => {
		const { geo } = request.body;
		if (!geo) return lineItems;
		return lineItems.filter((li) => li.geo === geo);
	},

	cpm: (
		lineItems: LineItem[],
		request: FastifyRequest<{ Body: LineItemFilterBody }>,
	) => {
		const { cpm } = request.body;
		if (cpm === undefined) return lineItems;
		return lineItems.filter((li) => li.minCpm <= cpm && li.maxCpm >= cpm);
	},

	frequencyCap: (
		lineItems: LineItem[],
		_request: FastifyRequest<{ Body: LineItemFilterBody }>,
		served = new Map<string, Set<number>>(),
		userId: string,
	) => {
		if (!userId) return lineItems;

		const userServed = served.get(userId) || new Set<number>();
		return lineItems.filter((li) => !userServed.has(li.id));
	},

	applyAll: (
		lineItems: LineItem[],
		request: FastifyRequest<{ Body: LineItemFilterBody }>,
		served = new Map<string, Set<number>>(),
		userId: string,
	) => {
		let items = lineItems;
		items = Filters.size(items, request);
		items = Filters.geo(items, request);
		items = Filters.cpm(items, request);
		items = Filters.frequencyCap(items, request, served, userId);
		return items;
	},
};
