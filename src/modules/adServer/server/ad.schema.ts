import { lineItemSchema } from "../lineItem/line-item.schema";
export const adSchema = {
	description: "Serve ad to bidder adapter",
	tags: ["AdServer"],
	body: {
		type: "object",
		required: [
			"size",
			"minCpm",
			"maxCpm",
			"geo",
			"adType",
			"frequencyCap",
			"creative",
		],
		properties: {
			size: { type: "string" },
			minCpm: { type: "string" },
			maxCpm: { type: "string" },
			geo: { type: "string" },
			adType: { type: "string", enum: ["banner", "video"] },
			frequencyCap: { type: "string" },
			creative: { type: "string" },
		},
	},
	response: {
		200: {
			type: "object",
			properties: {
				ok: { type: "boolean" },
				lineItem: lineItemSchema,
				message: { type: "string" },
			},
		},
	},
};

export const LineItemFilterSchema = {
	type: "object",
	properties: {
		size: { type: "string" },
		geo: { type: "string" },
		cpm: { type: "number" },
		userId: { type: "string" },
	},
	additionalProperties: false,
};

export type LineItemFilterBody = {
	size?: string;
	geo?: string;
	cpm?: number;
	userId?: string;
};
