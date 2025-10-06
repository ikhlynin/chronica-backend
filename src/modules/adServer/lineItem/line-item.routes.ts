import type { FastifyInstance } from "fastify";
import { lineItemGetForm } from "./line-item.schema";
import lineItemService from "./line-item.service";

const lineItemRoutes = async (fastify: FastifyInstance) => {
	fastify.get(
		"/getForm",
		{ schema: lineItemGetForm },
		lineItemService.getLineItemForm,
	);
	fastify.post("/createItem", lineItemService.createLineItem);
};

export default lineItemRoutes;
