import { error, fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { ListingService } from "$lib/services/listing.service";
import { ClaimService } from "$lib/services/claim.service";
import { ClaimStatus } from "@prisma/client";
import { z } from "zod";

const claimSchema = z.object({
  listingId: z.string().min(1, "Listing ID is required."),
  slug: z.string().min(1),
  proofFileUrl: z.string().url("Please provide a valid document URL.").min(1, "Proof document or link is required."),
  note: z.string().optional(),
});

export const load: PageServerLoad = async ({ params, locals }) => {
  const listing = await ListingService.getBySlug(params.slug);

  if (!listing) {
    throw error(404, "Listing not found");
  }

  const isAlreadyClaimed =
    listing.claimStatus === ClaimStatus.claimed ||
    listing.claimStatus === ClaimStatus.verified;

  return {
    listing,
    isAlreadyClaimed,
    user: locals.user,
  };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    if (!locals.user) {
      return fail(401, {
        error: "You must be signed in to claim a business profile.",
      });
    }

    const formData = await request.formData();
    const rawData = {
      listingId: formData.get("listingId"),
      slug: formData.get("slug"),
      proofFileUrl: formData.get("proofFileUrl"),
      note: formData.get("note") || undefined,
    };

    const validation = claimSchema.safeParse(rawData);
    if (!validation.success) {
      return fail(400, {
        error: "Please provide a valid proof document URL and listing details.",
      });
    }

    try {
      await ClaimService.submitClaim({
        listingId: validation.data.listingId,
        userId: locals.user.id,
        proofFileUrl: validation.data.proofFileUrl,
        note: validation.data.note,
      });

      return {
        success: true,
        message:
          "Your verification request has been submitted! Our local moderation team will verify your ownership documents within 24 hours.",
      };
    } catch (err) {
      return fail(500, {
        error: err instanceof Error ? err.message : "Failed to submit claim request.",
      });
    }
  },
};
