import { t as db } from "./client.js";
import { n as stripHtml, t as sanitizeRichText } from "./sanitize.js";
import { ClaimStatus, ListingStatus, Prisma } from "@prisma/client";
// src/lib/services/listing.service.ts
var ListingService = class {
	/**
	* Retrieves a single published listing by its slug for public presentation.
	* Includes categories, locations, pricing plan privileges, and media.
	*/
	static async getBySlug(slug) {
		const listing = await db.listing.findUnique({
			where: { slug },
			include: {
				categories: { include: { category: true } },
				locations: { include: { location: true } },
				plan: true,
				media: {
					where: { scanStatus: "clean" },
					orderBy: { createdAt: "asc" }
				},
				reviews: {
					where: { status: "approved" },
					orderBy: { createdAt: "desc" },
					take: 10
				}
			}
		});
		if (!listing || listing.status !== ListingStatus.published) return null;
		return listing;
	}
	/**
	* Increments view count safely in the background
	*/
	static async trackView(id) {
		await db.listing.update({
			where: { id },
			data: { viewCount: { increment: 1 } }
		}).catch(() => {});
	}
	/**
	* Fetch all listings owned by an authenticated user (DAL owner check)
	*/
	static async getByOwnerId(ownerId) {
		return await db.listing.findMany({
			where: { ownerId },
			include: {
				plan: true,
				_count: { select: {
					reviews: true,
					enquiries: true
				} }
			},
			orderBy: { createdAt: "desc" }
		});
	}
	/**
	* Create a new listing with sanitized inputs and plan bounds
	*/
	static async create(ownerId, input) {
		const slug = `${stripHtml(input.title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}-${Math.random().toString(36).substring(2, 6)}`;
		let planId = input.planId;
		if (!planId) planId = (await db.pricingPlan.findFirst({ where: { slug: "free" } }))?.id;
		return await db.listing.create({ data: {
			title: stripHtml(input.title),
			slug,
			description: sanitizeRichText(input.description),
			ownerId,
			claimStatus: ClaimStatus.claimed,
			status: ListingStatus.pending_review,
			planId,
			phone: input.phone?.trim() || null,
			whatsapp: input.whatsapp?.trim() || null,
			email: input.email?.trim() || null,
			website: input.website?.trim() || null,
			address: stripHtml(input.address),
			locality: stripHtml(input.locality),
			landmark: input.landmark ? stripHtml(input.landmark) : null,
			latitude: input.latitude !== void 0 ? new Prisma.Decimal(input.latitude) : null,
			longitude: input.longitude !== void 0 ? new Prisma.Decimal(input.longitude) : null,
			yearEstablished: input.yearEstablished ?? null,
			priceRange: input.priceRange ?? 1,
			openingHours: input.openingHours ?? Prisma.DbNull,
			amenities: input.amenities ?? [],
			socialLinks: input.socialLinks ?? Prisma.DbNull,
			categories: { create: input.categoryIds.map((categoryId) => ({ categoryId })) },
			locations: { create: input.locationIds.map((locationId, idx) => ({
				locationId,
				isPrimary: idx === 0
			})) }
		} });
	}
	/**
	* Update an existing listing with strict DAL owner validation
	*/
	static async update(ownerId, listingId, input) {
		if (!await db.listing.findFirst({ where: {
			id: listingId,
			ownerId
		} })) throw new Error("Listing not found or access denied.");
		return await db.listing.update({
			where: { id: listingId },
			data: {
				...input.title && { title: stripHtml(input.title) },
				...input.description && { description: sanitizeRichText(input.description) },
				...input.phone !== void 0 && { phone: input.phone ? input.phone.trim() : null },
				...input.whatsapp !== void 0 && { whatsapp: input.whatsapp ? input.whatsapp.trim() : null },
				...input.email !== void 0 && { email: input.email ? input.email.trim() : null },
				...input.website !== void 0 && { website: input.website ? input.website.trim() : null },
				...input.address && { address: stripHtml(input.address) },
				...input.locality && { locality: stripHtml(input.locality) },
				...input.landmark !== void 0 && { landmark: input.landmark ? stripHtml(input.landmark) : null },
				...input.latitude !== void 0 && { latitude: new Prisma.Decimal(input.latitude) },
				...input.longitude !== void 0 && { longitude: new Prisma.Decimal(input.longitude) },
				...input.yearEstablished !== void 0 && { yearEstablished: input.yearEstablished },
				...input.priceRange !== void 0 && { priceRange: input.priceRange },
				...input.openingHours !== void 0 && { openingHours: input.openingHours ?? Prisma.DbNull },
				...input.amenities !== void 0 && { amenities: input.amenities },
				...input.socialLinks !== void 0 && { socialLinks: input.socialLinks ?? Prisma.DbNull }
			}
		});
	}
};
export { ListingService as t };

//# sourceMappingURL=listing.service.js.map