import { t as ListingService } from "../../../../../chunks/listing.service.js";
// src/routes/(account)/dashboard/billing/+page.server.ts
var load = async ({ locals }) => {
	return { listings: await ListingService.getByOwnerId(locals.user.id) };
};
export { load };

//# sourceMappingURL=_page.server.ts.js.map