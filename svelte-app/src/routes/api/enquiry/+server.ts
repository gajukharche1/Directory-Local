import { json, type RequestHandler } from "@sveltejs/kit";
import { z } from "zod";
import { EnquiryService } from "$lib/services/enquiry.service";
import { rateLimits } from "$lib/security/rate-limit";

const enquirySchema = z.object({
  listingId: z.string().min(1, "Listing ID is required."),
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Valid email is required."),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters.").max(1000),
  honeypot: z.string().optional(),
  timestamp: z.coerce.number().optional(),
});

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
  const ip = getClientAddress() || "127.0.0.1";
  const rateCheck = await rateLimits.submission(ip);
  if (!rateCheck.success) {
    return json(
      { error: `Too many submissions. Please wait ${rateCheck.reset} seconds.` },
      { status: 429 }
    );
  }

  const formData = await request.formData();
  const rawData = {
    listingId: formData.get("listingId")?.toString(),
    name: formData.get("name")?.toString(),
    email: formData.get("email")?.toString(),
    phone: formData.get("phone")?.toString() || undefined,
    message: formData.get("message")?.toString(),
    honeypot: formData.get("website_url")?.toString() || undefined,
    timestamp: formData.get("form_loaded_at") ? Number(formData.get("form_loaded_at")) : undefined,
  };

  const validation = enquirySchema.safeParse(rawData);
  if (!validation.success) {
    return json(
      { error: "Please correct the form errors.", fieldErrors: validation.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    await EnquiryService.submitEnquiry(validation.data);
    return json({
      success: true,
      message: "Your enquiry has been forwarded directly to the business owner.",
    });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "Failed to deliver enquiry." },
      { status: 500 }
    );
  }
};
