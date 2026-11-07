// empty during dev
export const immutable = [];
export const prerendered = [];

export const assets = [
	{"path":"robots.txt"}
];

export const routes = [
	{"id":"/","page":true,"endpoint":false},
	{"id":"/(admin)/admin","page":true,"endpoint":false},
	{"id":"/(admin)/admin/imports","page":true,"endpoint":false},
	{"id":"/(admin)/admin/listings","page":true,"endpoint":false},
	{"id":"/(admin)/admin/moderation","page":true,"endpoint":false},
	{"id":"/api/cron/cleanup-sessions","page":false,"endpoint":true},
	{"id":"/api/cron/plan-expiry","page":false,"endpoint":true},
	{"id":"/api/cron/repair-aggregates","page":false,"endpoint":true},
	{"id":"/api/enquiry","page":false,"endpoint":true},
	{"id":"/api/health","page":false,"endpoint":true},
	{"id":"/api/search/autocomplete","page":false,"endpoint":true},
	{"id":"/api/webhooks/payments","page":false,"endpoint":true},
	{"id":"/(public)/category/[...slug]","page":true,"endpoint":false},
	{"id":"/(public)/claim/[slug]","page":true,"endpoint":false},
	{"id":"/(account)/dashboard","page":true,"endpoint":false},
	{"id":"/(account)/dashboard/billing","page":true,"endpoint":false},
	{"id":"/(account)/dashboard/enquiries","page":true,"endpoint":false},
	{"id":"/(account)/dashboard/listings","page":true,"endpoint":false},
	{"id":"/(account)/dashboard/reviews","page":true,"endpoint":false},
	{"id":"/(auth)/forgot-password","page":true,"endpoint":false},
	{"id":"/(public)/listing/[slug]","page":true,"endpoint":false},
	{"id":"/(public)/location/[...slug]","page":true,"endpoint":false},
	{"id":"/(auth)/login","page":true,"endpoint":false},
	{"id":"/(auth)/logout","page":false,"endpoint":true},
	{"id":"/(public)/pricing","page":true,"endpoint":false},
	{"id":"/(auth)/register","page":true,"endpoint":false},
	{"id":"/(public)/reviews/new","page":true,"endpoint":false},
	{"id":"/robots.txt","page":false,"endpoint":true},
	{"id":"/(public)/search","page":true,"endpoint":false},
	{"id":"/sitemap.xml","page":false,"endpoint":true},
	{"id":"/(public)/submit","page":true,"endpoint":false}
];