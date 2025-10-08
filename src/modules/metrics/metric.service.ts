import type { FastifyInstance, FastifyRequest } from "fastify";
import type {
	ClickHouseCountResponse,
	ClickHouseResponse,
	FetchMetricsOptions,
	MetricEvent,
} from "./metric.types";

const CACHE_LIMIT = 1000;
const TIMEOUT = 5000;

export class MetricService {
	private fastify: FastifyInstance;
	private eventCache: MetricEvent[] = [];
	private timeoutHandle: NodeJS.Timeout | null = null;

	constructor(fastify: FastifyInstance) {
		this.fastify = fastify;
	}

	private formatDate(ts: string | Date) {
		const d = new Date(ts);
		const yyyy = d.getFullYear();
		const mm = String(d.getMonth() + 1).padStart(2, "0");
		const dd = String(d.getDate()).padStart(2, "0");
		const hh = String(d.getHours()).padStart(2, "0");
		const min = String(d.getMinutes()).padStart(2, "0");
		const ss = String(d.getSeconds()).padStart(2, "0");
		return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
	}

	async fetchMetrics(options: FetchMetricsOptions = {}) {
		const {
			page = 1,
			limit = 100,
			events,
			adapters,
			creativeIds,
			date,
			hour,
		} = options;

		const offset = (page - 1) * limit;

		const conditions: string[] = [];

		if (events?.length)
			conditions.push(`event IN (${events.map((e) => `'${e}'`).join(",")})`);
		if (adapters?.length)
			conditions.push(
				`adapter IN (${adapters.map((a) => `'${a}'`).join(",")})`,
			);
		if (creativeIds?.length)
			conditions.push(
				`creativeId IN (${creativeIds.map((c) => `'${c}'`).join(",")})`,
			);
		if (date) conditions.push(`toDate(timestamp) = '${date}'`);
		if (hour !== undefined) conditions.push(`toHour(timestamp) = ${hour}`);

		const whereClause = conditions.length
			? `WHERE ${conditions.join(" AND ")}`
			: "";

		const result = await this.fastify.ch.query({
			query: `
			SELECT *
			FROM metrics
			${whereClause}
			ORDER BY timestamp DESC
			LIMIT ${limit} OFFSET ${offset}
		`,
		});

		const raw = await result.json<ClickHouseResponse<MetricEvent>>();
		const rows = raw.data;

		const countResult = await this.fastify.ch.query({
			query: `
			SELECT count(*) AS total
			FROM metrics
			${whereClause}
		`,
		});

		const countRaw = await countResult.json<ClickHouseCountResponse>();
		const [{ total }] = countRaw.data;

		return { page, limit, total, data: rows };
	}

	private async flushCache() {
		if (this.eventCache.length === 0) return;
		const dataToInsert = this.eventCache.splice(0, this.eventCache.length);
		this.timeoutHandle = null;

		await this.fastify.ch.insert({
			table: "metrics",
			values: dataToInsert.map((ev) => ({
				event: ev.event,
				timestamp: this.formatDate(ev.timestamp),
				pageUrl: ev.pageUrl,
				adapter: ev.adapter ?? "",
				adId: ev.adId ?? "",
				creativeId: ev.creativeId ?? "",
				cpm: ev.cpm ?? 0,
				userId: ev.userId ?? "",
			})),
			format: "JSONEachRow",
		});
	}

	addEvents(events: MetricEvent | MetricEvent[], request?: FastifyRequest) {
		let userId: string | undefined;

		try {
			const token = request?.cookies?.token;
			if (token) {
				const payload = this.fastify.jwt.verify<{ userId: string }>(token);
				userId = payload.userId;
			}
		} catch {}

		const normalizedEvents = (Array.isArray(events) ? events : [events]).map(
			(ev) => ({ ...ev, userId }),
		);

		this.eventCache.push(...normalizedEvents);

		if (!this.timeoutHandle) {
			this.timeoutHandle = setTimeout(
				() => this.flushCache().catch(console.error),
				TIMEOUT,
			);
		}

		if (this.eventCache.length >= CACHE_LIMIT) {
			this.flushCache().catch(console.error);
		}
	}
}
