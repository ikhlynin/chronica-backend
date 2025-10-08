import type { FastifyInstance } from "fastify";
import { lineItemCreateSchema, lineItemGetForm } from "./line-item.schema";
import lineItemService from "./line-item.service";

const lineItemRoutes = async (fastify: FastifyInstance) => {
	fastify.get(
		"/getForm",
		{ schema: lineItemGetForm },
		lineItemService.getLineItemForm,
	);
	fastify.post(
		"/createItem",
		{ schema: lineItemCreateSchema },
		lineItemService.createLineItem,
	);
};

export default lineItemRoutes;
