export const lineItemGetForm = {
	description: "Get HTML form to create a line item",
	tags: ["LineItem"],
	response: {
		200: { type: "string" },
	},
};

export const lineItemSchema = {
	type: "object",
	properties: {
		id: { type: "string" },
		size: { type: "string" },
		minCpm: { type: "string" },
		maxCpm: { type: "string" },
		geo: { type: "string" },
		adType: { type: "string", enum: ["banner", "video"] },
		frequencyCap: { type: "string" },
		creativeUrl: { type: "string" },
		createdAt: { type: "string", format: "date-time" },
	},
};

export const lineItemCreateSchema = {
	description: "Create a new line item",
	tags: ["LineItem"],
	consumes: ["multipart/form-data"],
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
			creative: { type: "object" },
		},
	},
	response: {
		200: {
			type: "object",
			properties: {
				ok: { type: "boolean" },
				lineItem: lineItemSchema,
			},
		},
	},
};
