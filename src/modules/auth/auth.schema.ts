export const signupSchema = {
	body: {
		type: "object",
		properties: {
			email: { type: "string", format: "email" },
			name: { type: "string", minLength: 1 },
			password: { type: "string", minLength: 3 },
		},
		required: ["email", "name", "password"],
		additionalProperties: false,
	},
};

export const loginSchema = {
	body: {
		type: "object",
		properties: {
			email: { type: "string", format: "email" },
			password: { type: "string", minLength: 3 },
		},
		required: ["email", "password"],
		additionalProperties: false,
	},
};
