export const articleSchema = {
	description: "Parse article with Cheerio",
	tags: ["Article"],
	summary: "Return parsed article",
	response: {
		200: {
			type: "object",
			properties: {
				ok: { type: "boolean", description: "Status of the request" },
				article: {
					type: "object",
					properties: {
						title: { type: "string", description: "Article title" },
						image: { type: "string", description: "Article image URL" },
						content: { type: "string", description: "Full article content" },
						url: { type: "string", description: "Original article URL" },
						creator: { type: "string", description: "Author of the article" },
						isoDate: {
							type: "string",
							description: "Publication date in ISO format",
						},
					},
					required: ["title", "content", "url"],
					additionalProperties: false,
					example: {
						title:
							"From Bayern despair to Liverpool brilliance - the rise of Gravenberch",
						image: "https://ichef.bbci.co.uk/wwhp/624/cpsprodpb/12345.jpg",
						content:
							"Midfielder Ryan Gravenberch has played a starring role for Liverpool this season...",
						url: "https://www.bbc.com/sport/football/articles/crmedk29jzwo?at_medium=RSS&at_campaign=rss",
						creator: "Phil McNulty",
						isoDate: "2025-09-25T06:01:43.424Z",
					},
				},
			},
			required: ["ok", "article"],
			additionalProperties: false,
			example: {
				ok: true,
				article: {
					title:
						"From Bayern despair to Liverpool brilliance - the rise of Gravenberch",
					image: "https://ichef.bbci.co.uk/wwhp/624/cpsprodpb/12345.jpg",
					content:
						"Midfielder Ryan Gravenberch has played a starring role for Liverpool this season...",
					url: "https://www.bbc.com/sport/football/articles/crmedk29jzwo?at_medium=RSS&at_campaign=rss",
					creator: "Phil McNulty",
					isoDate: "2025-09-25T06:01:43.424Z",
				},
			},
		},
	},
};
