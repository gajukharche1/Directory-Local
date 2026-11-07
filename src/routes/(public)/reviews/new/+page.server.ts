import { error, fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { ListingService } from "$lib/services/listing.service";
import { ReviewService } from "$lib/services/review.service";
import { rateLimits } from "$lib/security/rate-limit";
import { z } from "zod";
import { toPOJO } from "$lib/utils";

const reviewSchema = z.object({
  listingId: z.string().min(1, "Listing ID is required."),
  rating: z.coerce.number().min(1).max(5, "Rating must be between 1 and 5."),
  title: z.string().min(3, "Title must be at least 3 characters.").max(120),
  body: z.string().min(10, "Review must be at least 10 characters.").max(2000),
  reviewerName: z.string().min(2, "Name must be at least 2 characters."),
  reviewerEmail: z.string().email("Valid email is required."),
  slug: z.string().optional(),
});

export const load: PageServerLoad = async ({ url, locals }) => {
  const listingSlug = url.searchParams.get("listing");

  if (!listingSlug) {
    throw error(404, "Listing not specified");
  }

  const listing = await ListingService.getBySlug(listingSlug);

  if (!listing) {
    throw error(404, "Listing not found");
  }

  return toPOJO({
    listing,
    user: locals.user,
  });
};

export const actions: Actions = {
  default: async ({ request, getClientAddress, locals }) => {
    let ip = "127.0.0.1";
    try {
      ip = getClientAddress();
    } catch {
      // Fallback
    }

    const rateLimitResult = await rateLimits.submission(ip);
    if (!rateLimitResult.success) {
      return fail(429, {
        error: `Too many submissions. Please wait ${rateLimitResult.reset} seconds before trying again.`,
      });
    }

    const formData = await request.formData();
    const rawData = {
      listingId: formData.get("listingId"),
      rating: formData.get("rating"),
      title: formData.get("title"),
      body: formData.get("body"),
      reviewerName: formData.get("reviewerName"),
      reviewerEmail: formData.get("reviewerEmail"),
      slug: formData.get("slug") || undefined,
    };

    const validation = reviewSchema.safeParse(rawData);
    if (!validation.success) {
      return fail(400, {
        error: "Please correct the form errors.",
        fieldErrors: validation.error.flatten().fieldErrors,
      });
    }

    try {
      const review = await ReviewService.submitReview({
        ...validation.data,
        authorId: locals.user?.id,
      });

      return {
        success: true,
        message:
          review.status === "approved"
            ? "Thank you! Your review has been published."
            : "Thank you! Your review has been submitted and will appear after moderation approval.",
      };
    } catch (err) {
      return fail(500, {
        error: err instanceof Error ? err.message : "Failed to submit review.",
      });
    }
  },
};
