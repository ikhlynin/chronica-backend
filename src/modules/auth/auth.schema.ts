export const signupSchema = {
	description:
		"Endpoint for user registration in the system with email, name, and password",
	tags: ["Auth"],
	summary: "Register a new user",
	body: {
		type: "object",
		properties: {
			email: {
				type: "string",
				format: "email",
				description: "Valid email address used for login",
			},
			name: {
				type: "string",
				minLength: 1,
				description: "Full name of the user",
			},
			password: {
				type: "string",
				minLength: 3,
				description: "Password for the account (minimum 3 characters)",
			},
		},
		required: ["email", "name", "password"],
		additionalProperties: false,
	},
	response: {
		200: {
			description: "User successfully registered",
			type: "object",
			properties: {
				user: {
					type: "object",
					properties: {
						id: { type: "string", description: "User ID" },
						email: { type: "string", description: "User email" },
						name: { type: "string", description: "User name" },
					},
				},
			},
		},
		400: {
			description: "Request validation failed or email already exists",
			type: "object",
			properties: {
				error: { type: "string" },
			},
		},
	},
};

export const loginSchema = {
	description: "Endpoint for user authentication with email and password",
	tags: ["Auth"],
	summary: "Authenticate a user",
	body: {
		type: "object",
		properties: {
			email: {
				type: "string",
				format: "email",
				description: "User email address",
			},
			password: {
				type: "string",
				minLength: 3,
				description: "Password for the account",
			},
		},
		required: ["email", "password"],
		additionalProperties: false,
	},
	response: {
		200: {
			description: "User successfully authenticated",
			type: "object",
			properties: {
				user: {
					type: "object",
					properties: {
						id: { type: "string", description: "User ID" },
						email: { type: "string", description: "User email" },
						name: { type: "string", description: "User name" },
					},
				},
			},
		},
		400: {
			description: "Request validation failed or email already exists",
			type: "object",
			properties: {
				error: { type: "string" },
			},
		},
	},
};

export const logoutSchema = {
	description: "Endpoint for logging out the user.",
	tags: ["Auth"],
	summary: "Logs out the authenticated user and clears the session cookie",
	response: {
		200: {
			description: "User successfully logged out",
			type: "object",
			properties: {
				message: {
					type: "string",
					description: "Confirmation message of logout",
				},
			},
		},
		400: {
			description: "Logout failed due to invalid request or server error",
			type: "object",
			properties: {
				error: {
					type: "string",
					description: "Error message describing the problem",
				},
			},
		},
	},
};
