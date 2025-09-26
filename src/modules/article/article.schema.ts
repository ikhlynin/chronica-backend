export const articleSchema = {
	description: "Parse article with cherio",
	tags: ["Article"],
	summary: "Return parsed article",
	response: {
		200: {
			type: "object",
			properties: {
				title: { type: "string" },
				image: { type: "string" },
				content: { type: "string" },
				url: { type: "string" },
				creator: { type: "string" },
				pubDate: { type: "string" },
			},
		},
	},
};
