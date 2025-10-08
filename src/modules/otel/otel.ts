import os from "node:os";
import { metrics } from "@opentelemetry/api";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { PrometheusExporter } from "@opentelemetry/exporter-prometheus";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { FastifyInstrumentation } from "@opentelemetry/instrumentation-fastify";
import { FsInstrumentation } from "@opentelemetry/instrumentation-fs";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { MongoDBInstrumentation } from "@opentelemetry/instrumentation-mongodb";
import { PinoInstrumentation } from "@opentelemetry/instrumentation-pino";
import { SimpleLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { NodeSDK } from "@opentelemetry/sdk-node";

export default async function startOtel() {
	const logExporter = new OTLPLogExporter({ url: process.env.OTEL_LOGS_URL });
	const traceExporter = new OTLPTraceExporter({
		url: process.env.OTEL_TRACES_URL,
	});

	const prometheusExporter = new PrometheusExporter({
		port: Number(process.env.PROMETHEUS_PORT || 9464),
		host: process.env.PROMETHEUS_HOST || "0.0.0.0",
	});

	const sdk = new NodeSDK({
		traceExporter,
		metricReader: prometheusExporter,
		logRecordProcessors: [new SimpleLogRecordProcessor(logExporter)],
		instrumentations: [
			new FastifyInstrumentation(),
			new FsInstrumentation(),
			new MongoDBInstrumentation(),
			new PinoInstrumentation(),
			new HttpInstrumentation(),
		],
		serviceName: process.env.SERVICE_NAME || "fastify-app",
	});

	await sdk.start();

	const meter = metrics.getMeter(process.env.SERVICE_NAME || "fastify-app");

	let lastTotal = 0;
	let lastIdle = 0;

	const cpuGauge = meter.createObservableGauge("system_cpu_percent");
	cpuGauge.addCallback((result) => {
		const cpus = os.cpus();
		let idle = 0;
		let total = 0;

		cpus.forEach((cpu) => {
			for (const type in cpu.times) {
				total += cpu.times[type as keyof typeof cpu.times];
			}
			idle += cpu.times.idle;
		});

		const idleDiff = idle - lastIdle;
		const totalDiff = total - lastTotal;
		const usage = 100 - (idleDiff / totalDiff) * 100;

		lastIdle = idle;
		lastTotal = total;
		result.observe(usage);
	});

	const shutdown = async () => {
		await sdk.shutdown();
		process.exit(0);
	};

	process.on("SIGTERM", shutdown);
	process.on("SIGINT", shutdown);

	return sdk;
}
