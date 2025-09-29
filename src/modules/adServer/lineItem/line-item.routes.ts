import type { FastifyInstance } from "fastify";
import lineItemController from "./line-item.controller";
import { lineItemCreate, lineItemGetForm } from "./line-item.schema";

const lineItemRoutes = async (fastify: FastifyInstance) => {
	fastify.get(
		"/getForm",
		{ schema: lineItemGetForm },
		lineItemController.getLineItemForm,
	);
	fastify.post(
		"/createItem",
		{ schema: lineItemCreate },
		lineItemController.createLineItem,
	);
};

export default lineItemRoutes;
