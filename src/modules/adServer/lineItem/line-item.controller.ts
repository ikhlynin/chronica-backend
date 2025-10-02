import fs from "node:fs";
import path from "node:path";
import type { MultipartFile } from "@fastify/multipart";
import type { FastifyReply, FastifyRequest } from "fastify";
import { lineItemFormHTML } from "./line-item.form";

const lineItemController = {
	getLineItemForm: async (_request: FastifyRequest, reply: FastifyReply) => {
		reply.type("text/html").send(lineItemFormHTML);
	},

	createLineItem: async (request: FastifyRequest, reply: FastifyReply) => {
		const file: MultipartFile | undefined = await request.file();
		if (!file)
			return reply.status(400).send({ ok: false, message: "No file uploaded" });

		const body = request.body as Record<string, string>;
		const { size, minCpm, maxCpm, geo, adType, frequencyCap } = body;

		console.log("FIELDS:", body);
		console.log("FILE:", file);

		const publicDir = path.join(__dirname, "../../../public");
		if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

		const filePath = path.join(publicDir, file.filename);
		await fs.promises.writeFile(filePath, await file.toBuffer());

		const lineItem = await request.server.prisma.lineItem.create({
			data: {
				size,
				minCpm: parseFloat(minCpm),
				maxCpm: parseFloat(maxCpm),
				geo,
				adType,
				frequencyCap: parseInt(frequencyCap, 10),
				creativeUrl: `/public/${file.filename}`,
			},
		});
		reply.send({ ok: true, lineItem });
	},
};

export default lineItemController;
