import type { FastifyInstance } from "fastify";

interface Event {
	event_id: number;
	slice: string;
	slice_name: string;
	value: number;
	created_at?: string;
}

const CACHE_LIMIT = 1000;
const TIMEOUT = 5000;

const eventCache: Event[] = [];
let timeoutHandle: NodeJS.Timeout | null = null;

export function initEventCache(fastify: FastifyInstance) {
	async function flushCache() {
		if (eventCache.length === 0) return;
		const dataToInsert = eventCache.splice(0, eventCache.length);
		timeoutHandle = null;

		const values = dataToInsert
			.map(
				(ev) =>
					`(${ev.event_id}, '${ev.slice}', '${ev.slice_name}', ${ev.value}, now())`,
			)
			.join(",");

		await fastify.ch.query({
			query: `INSERT INTO events (event_id, slice, slice_name, value, created_at) VALUES ${values}`,
		});
	}

	function addEvents(events: Event[]) {
		eventCache.push(...events);

		if (!timeoutHandle) {
			timeoutHandle = setTimeout(flushCache, TIMEOUT);
		}

		if (eventCache.length >= CACHE_LIMIT) {
			flushCache();
		}
	}

	return { addEvents, flushCache };
}
