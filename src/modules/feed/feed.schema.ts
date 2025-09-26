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
				title: { type: "string", description: "Feed title" },
				link: { type: "string", description: "Feed link" },
				items: {
					type: "array",
					items: {
						type: "object",
						properties: {
							title: { type: "string", description: "Item title" },
							link: { type: "string", description: "Item link" },
							pubDate: { type: "string", description: "Publication date" },
							content: { type: "string", description: "Item content" },
						},
					},
				},
			},
		},
		400: {
			description: "Invalid URL or feed could not be retrieved",
			type: "object",
			properties: {
				error: { type: "string" },
			},
		},
	},
};
