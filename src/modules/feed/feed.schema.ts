export const FeedSchema = {
	querystring: {
		type: "object",
		properties: {
			url: { type: "string" },
			force: { type: "string" },
		},
		additionalProperties: false,
	},
};
