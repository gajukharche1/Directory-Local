// src/lib/security/rate-limit.ts
var memoryStore = /* @__PURE__ */ new Map();
if (typeof setInterval !== "undefined") setInterval(() => {
	const now = Date.now();
	for (const [key, record] of memoryStore.entries()) {
		record.timestamps = record.timestamps.filter((ts) => now - ts < 36e5);
		if (record.timestamps.length === 0) memoryStore.delete(key);
	}
}, 3e5).unref?.();
async function checkRateLimit(identifier, limit = 60, windowSeconds = 60) {
	const now = Date.now();
	const windowMs = windowSeconds * 1e3;
	const cutoff = now - windowMs;
	let record = memoryStore.get(identifier);
	if (!record) {
		record = { timestamps: [] };
		memoryStore.set(identifier, record);
	}
	record.timestamps = record.timestamps.filter((timestamp) => timestamp > cutoff);
	if (record.timestamps.length >= limit) {
		const oldestTimestamp = record.timestamps[0] ?? now;
		const reset = Math.ceil((oldestTimestamp + windowMs - now) / 1e3);
		return {
			success: false,
			limit,
			remaining: 0,
			reset: Math.max(reset, 1)
		};
	}
	record.timestamps.push(now);
	return {
		success: true,
		limit,
		remaining: limit - record.timestamps.length,
		reset: windowSeconds
	};
}
/**
* Pre-configured rate limits for common operations
*/
var rateLimits = {
	auth: (ip) => checkRateLimit(`rate:auth:${ip}`, 10, 900),
	search: (ip) => checkRateLimit(`rate:search:${ip}`, 120, 60),
	submission: (ip) => checkRateLimit(`rate:submit:${ip}`, 5, 1800),
	upload: (identifier) => checkRateLimit(`rate:upload:${identifier}`, 20, 3600)
};
export { rateLimits as t };

//# sourceMappingURL=rate-limit.js.map