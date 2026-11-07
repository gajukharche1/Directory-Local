import { t as EnquiryService } from "../../../../../chunks/enquiry.service.js";
// src/routes/(account)/dashboard/enquiries/+page.server.ts
var load = async ({ locals }) => {
	return { enquiries: await EnquiryService.getEnquiriesForOwner(locals.user.id) };
};
export { load };

//# sourceMappingURL=_page.server.ts.js.map