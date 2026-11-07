import { fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import db from "$lib/db/client";
import { ReviewService } from "$lib/services/review.service";
import { toPOJO } from "$lib/utils";

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.user!;

  const reviews = await db.review
    .findMany({
      where: {
        listing: {
          ownerId: user.id,
        },
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
    .catch(() => []);

  return toPOJO({ reviews });
};

export const actions: Actions = {
  reply: async ({ request, locals }) => {
    const user = locals.user!;
    const formData = await request.formData();
    const reviewId = formData.get("reviewId") as string;
    const replyText = formData.get("replyText") as string;

    if (!reviewId || !replyText || !replyText.trim()) {
      return fail(400, { error: "Please enter a response message." });
    }

    try {
      await ReviewService.addOwnerReply(reviewId, user.id, replyText);
      return { success: true };
    } catch (err) {
      return fail(400, {
        error: err instanceof Error ? err.message : "Failed to post response.",
      });
    }
  },
};
