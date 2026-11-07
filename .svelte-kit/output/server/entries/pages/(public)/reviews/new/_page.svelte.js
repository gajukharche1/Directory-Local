import { D as FILENAME, E as escape_html, S as attr, a as derived, c as head, g as push_element, h as pop_element, m as stringify, s as ensure_array_like } from "../../../../../chunks/server.js";
import { t as Star } from "../../../../../chunks/star.js";
import { t as Circle_check } from "../../../../../chunks/circle-check.js";
import { t as Circle_alert } from "../../../../../chunks/circle-alert.js";
import "../../../../../chunks/forms.js";
import { t as Arrow_left } from "../../../../../chunks/arrow-left.js";
import { t as Shield_check } from "../../../../../chunks/shield-check.js";
import { t as Check } from "../../../../../chunks/check.js";
// src/lib/components/reviews/ReviewForm.svelte
ReviewForm[FILENAME] = "src/lib/components/reviews/ReviewForm.svelte";
function ReviewForm($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { listingId, listingTitle, slug, initialName = "", initialEmail = "", form = null } = $$props;
		let rating = 5;
		let isPending = false;
		if (form?.success) {
			$$renderer.push(`<!--[0--><div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">`);
			push_element($$renderer, "div", 29, 2);
			Circle_check($$renderer, { class: "h-10 w-10 text-emerald-600 mx-auto mb-2" });
			$$renderer.push(`<!----> <h3 class="font-bold text-base text-slate-900 mb-1">`);
			push_element($$renderer, "h3", 31, 4);
			$$renderer.push(`Review Submitted!</h3>`);
			pop_element();
			$$renderer.push(` <p class="text-xs text-slate-600 max-w-sm mx-auto">`);
			push_element($$renderer, "p", 32, 4);
			$$renderer.push(`${escape_html(form.message)}</p>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
		} else {
			$$renderer.push(`<!--[-1--><div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">`);
			push_element($$renderer, "div", 37, 2);
			$$renderer.push(`<div class="mb-5 pb-3 border-b border-slate-100">`);
			push_element($$renderer, "div", 38, 4);
			$$renderer.push(`<h3 class="font-bold text-base text-slate-900">`);
			push_element($$renderer, "h3", 39, 6);
			$$renderer.push(`Write a Review for ${escape_html(listingTitle)}</h3>`);
			pop_element();
			$$renderer.push(` <p class="text-xs text-slate-500 mt-0.5">`);
			push_element($$renderer, "p", 40, 6);
			$$renderer.push(`Share your verified experience to help neighbors in Pimple Saudagar</p>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
			$$renderer.push(` `);
			if (form?.error) {
				$$renderer.push(`<!--[0--><div class="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 flex items-start gap-2">`);
				push_element($$renderer, "div", 46, 6);
				Circle_alert($$renderer, { class: "h-4 w-4 shrink-0 mt-0.5" });
				$$renderer.push(`<!----> <span>`);
				push_element($$renderer, "span", 48, 8);
				$$renderer.push(`${escape_html(form.error)}</span>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <form method="POST" class="space-y-4">`);
			push_element($$renderer, "form", 52, 4);
			$$renderer.push(`<input type="hidden" name="listingId"${attr("value", listingId)}/>`);
			push_element($$renderer, "input", 63, 6);
			pop_element();
			$$renderer.push(` <input type="hidden" name="rating"${attr("value", rating)}/>`);
			push_element($$renderer, "input", 64, 6);
			pop_element();
			$$renderer.push(` `);
			if (slug) {
				$$renderer.push(`<!--[0--><input type="hidden" name="slug"${attr("value", slug)}/>`);
				push_element($$renderer, "input", 66, 8);
				pop_element();
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div>`);
			push_element($$renderer, "div", 70, 6);
			$$renderer.push(`<label for="review-rating" class="block text-xs font-semibold text-slate-700 mb-1.5">`);
			push_element($$renderer, "label", 71, 8);
			$$renderer.push(`Your Overall Rating</label>`);
			pop_element();
			$$renderer.push(` <div id="review-rating" class="flex items-center gap-1.5">`);
			push_element($$renderer, "div", 74, 8);
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like([
				1,
				2,
				3,
				4,
				5
			]);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let star = each_array[$$index];
				$$renderer.push(`<button type="button" class="p-1 hover:scale-110 transition-transform focus:outline-none"${attr("aria-label", `Rate ${star} stars`)}>`);
				push_element($$renderer, "button", 76, 12);
				Star($$renderer, { class: `h-7 w-7 transition-colors ${rating >= star ? "fill-amber-400 text-amber-400" : "text-slate-200"}` });
				$$renderer.push(`<!----></button>`);
				pop_element();
			}
			$$renderer.push(`<!--]--> <span class="ml-2 text-xs font-semibold text-slate-700">`);
			push_element($$renderer, "span", 91, 10);
			$$renderer.push(`${escape_html("5.0 - Excellent")}</span>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
			$$renderer.push(` <div>`);
			push_element($$renderer, "div", 106, 6);
			$$renderer.push(`<label for="review-title" class="block text-xs font-semibold text-slate-700 mb-1">`);
			push_element($$renderer, "label", 107, 8);
			$$renderer.push(`Review Headline</label>`);
			pop_element();
			$$renderer.push(` <input id="review-title" type="text" name="title" required="" placeholder="e.g. Delicious food and great outdoor ambiance!" class="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"/>`);
			push_element($$renderer, "input", 110, 8);
			pop_element();
			$$renderer.push(` `);
			if (form?.fieldErrors?.title) {
				$$renderer.push(`<!--[0--><p class="mt-1 text-xs text-rose-600">`);
				push_element($$renderer, "p", 119, 10);
				$$renderer.push(`${escape_html(form.fieldErrors.title[0])}</p>`);
				pop_element();
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
			pop_element();
			$$renderer.push(` <div>`);
			push_element($$renderer, "div", 124, 6);
			$$renderer.push(`<label for="review-body" class="block text-xs font-semibold text-slate-700 mb-1">`);
			push_element($$renderer, "label", 125, 8);
			$$renderer.push(`Detailed Review</label>`);
			pop_element();
			$$renderer.push(` <textarea id="review-body" name="body" required=""${attr("rows", 4)} placeholder="What did you like or dislike? How was the service, hygiene, pricing, and staff behavior?" class="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 resize-y">`);
			push_element($$renderer, "textarea", 128, 8);
			$$renderer.push(`</textarea>`);
			pop_element();
			$$renderer.push(` `);
			if (form?.fieldErrors?.body) {
				$$renderer.push(`<!--[0--><p class="mt-1 text-xs text-rose-600">`);
				push_element($$renderer, "p", 137, 10);
				$$renderer.push(`${escape_html(form.fieldErrors.body[0])}</p>`);
				pop_element();
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
			pop_element();
			$$renderer.push(` <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">`);
			push_element($$renderer, "div", 142, 6);
			$$renderer.push(`<div>`);
			push_element($$renderer, "div", 143, 8);
			$$renderer.push(`<label for="reviewer-name" class="block text-xs font-semibold text-slate-700 mb-1">`);
			push_element($$renderer, "label", 144, 10);
			$$renderer.push(`Your Full Name</label>`);
			pop_element();
			$$renderer.push(` <input id="reviewer-name" type="text" name="reviewerName"${attr("value", initialName)} required="" placeholder="e.g. Pooja Sharma" class="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"/>`);
			push_element($$renderer, "input", 147, 10);
			pop_element();
			$$renderer.push(` `);
			if (form?.fieldErrors?.reviewerName) {
				$$renderer.push(`<!--[0--><p class="mt-1 text-xs text-rose-600">`);
				push_element($$renderer, "p", 157, 12);
				$$renderer.push(`${escape_html(form.fieldErrors.reviewerName[0])}</p>`);
				pop_element();
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
			pop_element();
			$$renderer.push(` <div>`);
			push_element($$renderer, "div", 161, 8);
			$$renderer.push(`<label for="reviewer-email" class="block text-xs font-semibold text-slate-700 mb-1">`);
			push_element($$renderer, "label", 162, 10);
			$$renderer.push(`Email Address (Private &amp; Hashed)</label>`);
			pop_element();
			$$renderer.push(` <input id="reviewer-email" type="email" name="reviewerEmail"${attr("value", initialEmail)} required="" placeholder="name@example.com" class="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"/>`);
			push_element($$renderer, "input", 165, 10);
			pop_element();
			$$renderer.push(` `);
			if (form?.fieldErrors?.reviewerEmail) {
				$$renderer.push(`<!--[0--><p class="mt-1 text-xs text-rose-600">`);
				push_element($$renderer, "p", 175, 12);
				$$renderer.push(`${escape_html(form.fieldErrors.reviewerEmail[0])}</p>`);
				pop_element();
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
			$$renderer.push(` <p class="text-[11px] text-slate-400">`);
			push_element($$renderer, "p", 180, 6);
			$$renderer.push(`🔒 Your email is cryptographically hashed with server pepper under DPDP Act 2023. We never display or sell your email address.</p>`);
			pop_element();
			$$renderer.push(` <button type="submit"${attr("disabled", isPending, true)} class="w-full inline-flex items-center justify-center rounded-xl bg-indigo-600 py-2.5 px-4 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition disabled:opacity-50">`);
			push_element($$renderer, "button", 184, 6);
			$$renderer.push(`<!--[-1--><span>`);
			push_element($$renderer, "span", 193, 10);
			$$renderer.push(`Submit Customer Review</span>`);
			pop_element();
			$$renderer.push(`<!--]--></button>`);
			pop_element();
			$$renderer.push(`</form>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
		}
		$$renderer.push(`<!--]-->`);
	}, ReviewForm);
}
ReviewForm.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
// src/routes/(public)/reviews/new/+page.svelte
_page[FILENAME] = "src/routes/(public)/reviews/new/+page.svelte";
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		let listing = derived(() => data.listing);
		head("hec1xs", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Write a Review for ${escape_html(listing().title)} | Pimple Saudagar Directory</title>`);
			});
		});
		$$renderer.push(`<div class="min-h-screen flex flex-col bg-background">`);
		push_element($$renderer, "div", 15, 0);
		$$renderer.push(`<header class="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">`);
		push_element($$renderer, "header", 17, 2);
		$$renderer.push(`<div class="container mx-auto px-4 flex h-14 items-center justify-between">`);
		push_element($$renderer, "div", 18, 4);
		$$renderer.push(`<a href="/" class="flex items-center gap-2">`);
		push_element($$renderer, "a", 19, 6);
		$$renderer.push(`<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm shadow-sm">`);
		push_element($$renderer, "div", 20, 8);
		$$renderer.push(`PS</div>`);
		pop_element();
		$$renderer.push(` <span class="font-bold tracking-tight text-sm text-foreground">`);
		push_element($$renderer, "span", 23, 8);
		$$renderer.push(`Pimple Saudagar Directory</span>`);
		pop_element();
		$$renderer.push(`</a>`);
		pop_element();
		$$renderer.push(` <a${attr("href", `/listing/${stringify(listing().slug)}`)} class="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">`);
		push_element($$renderer, "a", 27, 6);
		Arrow_left($$renderer, { class: "h-3.5 w-3.5" });
		$$renderer.push(`<!----> <span>`);
		push_element($$renderer, "span", 32, 8);
		$$renderer.push(`Back to Listing</span>`);
		pop_element();
		$$renderer.push(`</a>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(`</header>`);
		pop_element();
		$$renderer.push(` <main class="container mx-auto px-4 py-8 max-w-4xl flex-1">`);
		push_element($$renderer, "main", 37, 2);
		$$renderer.push(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">`);
		push_element($$renderer, "div", 38, 4);
		$$renderer.push(`<div class="lg:col-span-2">`);
		push_element($$renderer, "div", 39, 6);
		ReviewForm($$renderer, {
			listingId: listing().id,
			listingTitle: listing().title,
			slug: listing().slug,
			initialName: data.user?.name || "",
			initialEmail: data.user?.email || "",
			form
		});
		$$renderer.push(`<!----></div>`);
		pop_element();
		$$renderer.push(` <div class="space-y-4">`);
		push_element($$renderer, "div", 50, 6);
		$$renderer.push(`<div class="rounded-xl border bg-card p-5 shadow-card space-y-3">`);
		push_element($$renderer, "div", 51, 8);
		$$renderer.push(`<div class="flex items-center gap-2 pb-2 border-b">`);
		push_element($$renderer, "div", 52, 10);
		Shield_check($$renderer, { class: "h-4 w-4 text-primary" });
		$$renderer.push(`<!----> <h4 class="font-bold text-sm text-foreground">`);
		push_element($$renderer, "h4", 54, 12);
		$$renderer.push(`Review Guidelines</h4>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <ul class="space-y-2 text-xs text-muted-foreground">`);
		push_element($$renderer, "ul", 56, 10);
		$$renderer.push(`<li class="flex items-start gap-2">`);
		push_element($$renderer, "li", 57, 12);
		Check($$renderer, { class: "h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" });
		$$renderer.push(`<!----> <span>`);
		push_element($$renderer, "span", 59, 14);
		$$renderer.push(`Share genuine feedback based on personal customer experience.</span>`);
		pop_element();
		$$renderer.push(`</li>`);
		pop_element();
		$$renderer.push(` <li class="flex items-start gap-2">`);
		push_element($$renderer, "li", 61, 12);
		Check($$renderer, { class: "h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" });
		$$renderer.push(`<!----> <span>`);
		push_element($$renderer, "span", 63, 14);
		$$renderer.push(`Be constructive, polite, and detailed regarding service quality.</span>`);
		pop_element();
		$$renderer.push(`</li>`);
		pop_element();
		$$renderer.push(` <li class="flex items-start gap-2">`);
		push_element($$renderer, "li", 65, 12);
		Check($$renderer, { class: "h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" });
		$$renderer.push(`<!----> <span>`);
		push_element($$renderer, "span", 67, 14);
		$$renderer.push(`Avoid advertising links, phone numbers, or promotional text.</span>`);
		pop_element();
		$$renderer.push(`</li>`);
		pop_element();
		$$renderer.push(` <li class="flex items-start gap-2">`);
		push_element($$renderer, "li", 69, 12);
		Check($$renderer, { class: "h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" });
		$$renderer.push(`<!----> <span>`);
		push_element($$renderer, "span", 71, 14);
		$$renderer.push(`One review per person per business to maintain neighborhood trust.</span>`);
		pop_element();
		$$renderer.push(`</li>`);
		pop_element();
		$$renderer.push(`</ul>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(`</main>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
	}, _page);
}
_page.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map