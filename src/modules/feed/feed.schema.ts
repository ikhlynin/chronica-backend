export const FeedSchema = {
	description: "Fetch RSS feed",
	tags: ["Feed"],
	summary: "Get RSS feed data by URL",
	querystring: {
		type: "object",
		properties: {
			url: { type: "string", description: "URL of the RSS feed" },
			force: {
				type: "string",
				description: "Force refresh the feed (optional)",
			},
		},
		additionalProperties: false,
	},
	response: {
		200: {
			description: "Feed successfully retrieved",
			type: "object",
			properties: {
				items: {
					type: "array",
					items: {
						type: "object",
						properties: {
							title: { type: "string", description: "Item title" },
							link: { type: "string", description: "Item link" },
							guid: {
								type: "string",
								description: "Unique identifier for the item",
							},
							content: { type: "string", description: "Item content" },
							contentSnippet: {
								type: "string",
								description: "Short snippet of content",
							},
							isoDate: {
								type: "string",
								description: "Publication date in ISO format",
							},
							image: { type: "string", description: "URL to image (optional)" },
						},
						required: [
							"title",
							"link",
							"guid",
							"content",
							"contentSnippet",
							"isoDate",
						],
						additionalProperties: false,
					},
				},
			},
			required: ["items"],
			additionalProperties: false,
		},
		400: {
			description: "Invalid URL or feed could not be retrieved",
			type: "object",
			properties: {
				error: { type: "string" },
			},
			additionalProperties: false,
		},
	},
};
