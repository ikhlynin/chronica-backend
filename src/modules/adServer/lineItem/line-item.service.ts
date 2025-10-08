import fs from "node:fs";
import path from "node:path";
import type { MultipartFile } from "@fastify/multipart";
import type { FastifyReply, FastifyRequest } from "fastify";
import { lineItemFormHTML } from "./line-item.form";

type LineItemBodyField = {
	value: string;
};

type LineItemRequestBody = {
	size: LineItemBodyField;
	minCpm: LineItemBodyField;
	maxCpm: LineItemBodyField;
	geo: LineItemBodyField;
	adType: LineItemBodyField;
	frequencyCap: LineItemBodyField;
	creative: MultipartFile;
};

const lineItemService = {
	getLineItemForm: async (_request: FastifyRequest, reply: FastifyReply) => {
		reply.type("text/html").send(lineItemFormHTML);
	},

	createLineItem: async (
		request: FastifyRequest<{ Body: LineItemRequestBody }>,
		reply: FastifyReply,
	) => {
		try {
			const body = request.body;
			const creative = body.creative;
			if (!creative || creative.type !== "file") {
				return reply.badRequest("No file uploaded");
			}

			const fileBuffer = await creative.toBuffer();
			const fileName = creative.filename;

			const publicDir = path.join(path.resolve(process.cwd()), "uploads");
			if (!fs.existsSync(publicDir)) {
				fs.mkdirSync(publicDir, { recursive: true });
			}

			const filePath = path.join(publicDir, fileName);
			await fs.promises.writeFile(filePath, fileBuffer);

			const size = body.size?.value;
			const minCpm = body.minCpm?.value;
			const maxCpm = body.maxCpm?.value;
			const geo = body.geo?.value;
			const adType = body.adType?.value;
			const frequencyCap = body.frequencyCap?.value;

			if (!size || !minCpm || !maxCpm || !geo || !adType || !frequencyCap) {
				return reply.badRequest("Missing required fields");
			}

			const lineItem = await request.server.prisma.lineItem.create({
				data: {
					size,
					minCpm: parseFloat(minCpm),
					maxCpm: parseFloat(maxCpm),
					geo,
					adType,
					frequencyCap: parseInt(frequencyCap, 10),
					creativeUrl: `/public/${fileName}`,
				},
			});

			reply.send({ ok: true, lineItem });
		} catch (error) {
			return reply.internalServerError(error);
		}
	},
};

export default lineItemService;
