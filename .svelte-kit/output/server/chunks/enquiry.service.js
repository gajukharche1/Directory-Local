import { t as db } from "./client.js";
import { n as stripHtml } from "./sanitize.js";
import { t as EmailService } from "./email.service.js";
// src/lib/services/enquiry.service.ts
var EnquiryService = class {
	/**
	* Submits a direct lead enquiry to a business with bot protection
	*/
	static async submitEnquiry(input) {
		if (input.honeypot && input.honeypot.trim().length > 0) {
			console.warn("⚠️ Bot submission blocked by honeypot.");
			return {
				id: "blocked_bot",
				blocked: true
			};
		}
		if (input.timestamp) {
			const elapsedMs = Date.now() - input.timestamp;
			if (elapsedMs < 2e3) {
				console.warn(`⚠️ Fast submission blocked (${elapsedMs}ms).`);
				return {
					id: "blocked_fast",
					blocked: true
				};
			}
		}
		const cleanName = stripHtml(input.name);
		const cleanMessage = stripHtml(input.message);
		const cleanPhone = input.phone ? stripHtml(input.phone) : null;
		const enquiry = await db.enquiry.create({ data: {
			listingId: input.listingId,
			name: cleanName,
			email: input.email.toLowerCase().trim(),
			phone: cleanPhone,
			message: cleanMessage,
			ipHash: input.ipHash || null
		} });
		db.listing.findUnique({
			where: { id: input.listingId },
			select: {
				title: true,
				email: true,
				owner: { select: { email: true } }
			}
		}).then((listing) => {
			const targetEmail = listing?.owner?.email || listing?.email;
			if (targetEmail && listing) EmailService.sendLeadEnquiryEmail(targetEmail, {
				listingTitle: listing.title,
				customerName: cleanName,
				customerPhone: cleanPhone || "Not provided",
				customerEmail: input.email,
				message: cleanMessage
			}).catch((err) => console.error("Lead email delivery error:", err));
		}).catch((err) => console.warn("Failed to find listing for email alert:", err));
		return enquiry;
	}
	/**
	* Retrieves enquiries for an owner with DAL isolation
	*/
	static async getEnquiriesForOwner(ownerId) {
		return await db.enquiry.findMany({
			where: { listing: { ownerId } },
			include: { listing: { select: {
				id: true,
				title: true,
				slug: true
			} } },
			orderBy: { createdAt: "desc" }
		});
	}
	/**
	* Marks an enquiry as handled/read
	*/
	static async markAsRead(enquiryId, ownerId) {
		if (!await db.enquiry.findFirst({ where: {
			id: enquiryId,
			listing: { ownerId }
		} })) throw new Error("Enquiry not found or access denied.");
		return await db.enquiry.update({
			where: { id: enquiryId },
			data: {
				isRead: true,
				handledAt: /* @__PURE__ */ new Date()
			}
		});
	}
};
export { EnquiryService as t };

//# sourceMappingURL=enquiry.service.js.map