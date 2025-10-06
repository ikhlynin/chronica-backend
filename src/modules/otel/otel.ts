import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { PrometheusExporter } from "@opentelemetry/exporter-prometheus";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { NodeSDK } from "@opentelemetry/sdk-node";

const prometheusExporter = new PrometheusExporter({ port: 9464 });
console.log("Prometheus scrape endpoint: http://localhost:9464/metrics");

const tempoExporter = new OTLPTraceExporter({
	url: "http://localhost:4318/v1/traces",
});

export const otelSDK = new NodeSDK({
	traceExporter: tempoExporter,
	metricReader: prometheusExporter,
	instrumentations: [
		getNodeAutoInstrumentations({
			"@opentelemetry/instrumentation-fs": {},
			"@opentelemetry/instrumentation-mongodb": {},
			"@opentelemetry/instrumentation-redis": {},
			"@opentelemetry/instrumentation-pino": {},
		}),
	],
});

export async function startOtel() {
	await otelSDK.start();
	console.log("OpenTelemetry SDK started");
}

export function shutdownOtel() {
	const shutdown = async () => {
		await otelSDK.shutdown();
		console.log("OpenTelemetry SDK shut down");
		process.exit(0);
	};

	process.on("SIGINT", shutdown);
	process.on("SIGTERM", shutdown);
}
