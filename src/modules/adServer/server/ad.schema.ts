export const getBidsSchema = {
	type: "object",
	required: ["placementId", "bidId"],
	properties: {
		placementId: {
			type: "string",
			description: "Unique identifier of the ad slot",
		},
		bidId: {
			type: "string",
			description: "Unique identifier of the Prebid request",
		},
		size: {
			type: "string",
			description: "Optional banner size, e.g., '300x250'",
		},
		geo: { type: "string", description: "Optional user geolocation" },
		cpm: { type: "number", description: "Optional CPM filter" },
		userId: { type: "string", description: "Optional user ID" },
	},
	example: {
		placementId: "67890",
		bidId: "dfcdb2ab-0e72-4792-b667-11b567a334f9",
		size: "349x109",
		geo: "US",
		cpm: 1,
		userId: "68d506b6c21cabf070142d17",
	},
	response: {
		200: {
			type: "object",
			properties: {
				bids: {
					type: "array",
					items: {
						type: "object",
						properties: {
							bidId: { type: "string" },
							cpm: { type: "number" },
							width: { type: "number" },
							height: { type: "number" },
							ad: { type: "string" },
							creativeId: { type: "string" },
							currency: { type: "string" },
							ttl: { type: "number" },
						},
						required: [
							"bidId",
							"cpm",
							"width",
							"height",
							"ad",
							"creativeId",
							"currency",
							"ttl",
						],
						example: {
							bidId: "dfcdb2ab-0e72-4792-b667-11b567a334f9",
							cpm: 1,
							width: 349,
							height: 109,
							ad: '<img src="http://localhost:3000/public/photo_2025-09-27_16-25-29.jpg" width="349" height="109" />',
							creativeId: "68e30e3ca9e6ad7441a02968",
							currency: "USD",
							ttl: 300,
						},
					},
				},
			},
			required: ["bids"],
		},
	},
};

export type LineItemFilterBody = {
	bidId: string;
	size?: string;
	geo?: string;
	cpm?: number;
	userId?: string;
};
