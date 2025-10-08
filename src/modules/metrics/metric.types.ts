export interface MetricEvent {
	event: string;
	timestamp: string;
	pageUrl: string;
	adapter?: string;
	adId?: string;
	creativeId?: string | number;
	cpm?: number;
	userId?: string;
}

export interface ClickHouseResponse<T> {
	meta: { name: string; type: string }[];
	data: T[];
}

export interface ClickHouseCountResponse {
	meta: { name: string; type: string }[];
	data: { total: number }[];
}

export interface FetchMetricsOptions {
	page?: number;
	limit?: number;
	events?: string[];
	adapters?: string[];
	creativeIds?: string[];
	date?: string;
	hour?: number;
}
