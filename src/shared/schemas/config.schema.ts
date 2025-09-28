export const configSchema = {
	type: "object",
	required: ["DEFAULT_FEED_URL", "CORS_ORIGIN"],
	properties: {
		DATABASE_URL: { type: "string" },
		MONGO_INITDB_DATABASE: { type: "string", default: "chronica" },
		JWT_SECRET: { type: "string" },
		COOKIE_SECRET: { type: "string" },
		DEFAULT_FEED_URL: { type: "string" },
		CORS_ORIGIN: { type: "string" },
		CORS_LOCAL: { type: "string", default: "http://localhost:5173" },
		PORT: { type: "string", default: "3000" },
	},
};
