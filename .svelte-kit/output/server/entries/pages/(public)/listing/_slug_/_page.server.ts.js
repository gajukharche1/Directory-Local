import { t as ListingService } from "../../../../../chunks/listing.service.js";
import { error } from "@sveltejs/kit";
// src/lib/services/seo.service.ts
var SeoService = class {
	/**
	* Maps listing category slug to specific Schema.org LocalBusiness sub-types.
	*/
	static getSchemaType(categorySlug) {
		switch (categorySlug) {
			case "restaurants-cafes": return "Restaurant";
			case "dentists-dental-care":
			case "doctors-clinics": return "MedicalBusiness";
			case "gyms-fitness": return "HealthClub";
			case "beauty-salons-spa": return "BeautySalon";
			case "automotive-repairs": return "AutoRepair";
			case "schools-coaching": return "EducationalOrganization";
			case "grocery-supermarkets": return "GroceryStore";
			default: return "LocalBusiness";
		}
	}
	/**
	* Generates Schema.org LocalBusiness JSON-LD structure.
	*/
	static generateLocalBusinessSchema(listing, appUrl) {
		const primaryCategory = listing.categories?.[0]?.category;
		const schemaType = this.getSchemaType(primaryCategory?.slug);
		const listingUrl = `${appUrl}/listing/${listing.slug}`;
		const schema = {
			"@context": "https://schema.org",
			"@type": schemaType,
			"@id": listingUrl,
			name: listing.title,
			description: listing.description ? listing.description.replace(/<[^>]*>/g, "").slice(0, 300) : "",
			url: listingUrl,
			address: {
				"@type": "PostalAddress",
				streetAddress: listing.address,
				addressLocality: listing.locality || "Pimple Saudagar",
				addressRegion: "Maharashtra",
				postalCode: "411027",
				addressCountry: "IN"
			}
		};
		if (listing.phone) schema.telephone = listing.phone;
		if (listing.website) schema.sameAs = [listing.website];
		if (listing.latitude && listing.longitude) schema.geo = {
			"@type": "GeoCoordinates",
			latitude: Number(listing.latitude),
			longitude: Number(listing.longitude)
		};
		if (listing.priceRange) schema.priceRange = "₹".repeat(Math.min(4, Math.max(1, listing.priceRange)));
		if (listing.reviewCount > 0 && listing.averageRating) schema.aggregateRating = {
			"@type": "AggregateRating",
			ratingValue: Number(listing.averageRating).toFixed(1),
			reviewCount: listing.reviewCount,
			bestRating: "5",
			worstRating: "1"
		};
		if (listing.openingHours && typeof listing.openingHours === "object") {
			const dayMap = {
				monday: "https://schema.org/Monday",
				tuesday: "https://schema.org/Tuesday",
				wednesday: "https://schema.org/Wednesday",
				thursday: "https://schema.org/Thursday",
				friday: "https://schema.org/Friday",
				saturday: "https://schema.org/Saturday",
				sunday: "https://schema.org/Sunday"
			};
			const openingHoursSpec = [];
			for (const [day, val] of Object.entries(listing.openingHours)) if (dayMap[day] && val && !val.closed && val.open && val.close) openingHoursSpec.push({
				"@type": "OpeningHoursSpecification",
				dayOfWeek: dayMap[day],
				opens: val.open,
				closes: val.close
			});
			if (openingHoursSpec.length > 0) schema.openingHoursSpecification = openingHoursSpec;
		}
		return schema;
	}
	/**
	* Generates Schema.org BreadcrumbList JSON-LD structure.
	*/
	static generateBreadcrumbSchema(items, appUrl) {
		return {
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			itemListElement: items.map((item, index) => ({
				"@type": "ListItem",
				position: index + 1,
				name: item.name,
				item: item.url.startsWith("http") ? item.url : `${appUrl}${item.url}`
			}))
		};
	}
};
// src/routes/(public)/listing/[slug]/+page.server.ts
var load = async ({ params, url }) => {
	const listing = await ListingService.getBySlug(params.slug);
	if (!listing) throw error(404, "Business Not Found in Pimple Saudagar Directory");
	ListingService.trackView(listing.id).catch(() => {});
	const baseUrl = url.origin;
	const primaryCategory = listing.categories[0]?.category;
	return {
		listing,
		localBusinessSchema: SeoService.generateLocalBusinessSchema(listing, baseUrl),
		breadcrumbSchema: SeoService.generateBreadcrumbSchema([
			{
				name: "Home",
				url: "/"
			},
			...primaryCategory ? [{
				name: primaryCategory.name,
				url: `/category/${primaryCategory.slug}`
			}] : [],
			{
				name: listing.title,
				url: `/listing/${listing.slug}`
			}
		], baseUrl)
	};
};
export { load };

//# sourceMappingURL=_page.server.ts.js.map