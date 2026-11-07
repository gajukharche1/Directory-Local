import { C as clsx, D as FILENAME, E as escape_html, S as attr, b as prevent_snippet_stringification, c as head, d as sanitize_props, f as slot, g as push_element, h as pop_element, m as stringify, p as spread_props, s as ensure_array_like, t as attr_class } from "../../../../chunks/server.js";
import { t as Check } from "../../../../chunks/check.js";
import { t as Sparkles } from "../../../../chunks/sparkles.js";
import { t as Icon } from "../../../../chunks/Icon.js";
// node_modules/lucide-svelte/dist/icons/circle-question-mark.svelte
Circle_question_mark[FILENAME] = "node_modules/lucide-svelte/dist/icons/circle-question-mark.svelte";
function Circle_question_mark($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);
	$$renderer.component(($$renderer) => {
		/**
		* @license lucide-svelte v1.0.1 - ISC
		*
		* ISC License
		*
		* Copyright (c) 2026 Lucide Icons and Contributors
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The following Lucide icons are derived from the Feather project:
		*
		* airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out
		*
		* The MIT License (MIT) (for the icons listed above)
		*
		* Copyright (c) 2013-present Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		Icon($$renderer, spread_props([
			{ name: "circle-question-mark" },
			$$sanitized_props,
			{
				/**
				* @component @name CircleQuestionMark
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8cGF0aCBkPSJNOS4wOSA5YTMgMyAwIDAgMSA1LjgzIDFjMCAyLTMgMy0zIDMiIC8+CiAgPHBhdGggZD0iTTEyIDE3aC4wMSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/circle-question-mark
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [
					["circle", {
						"cx": "12",
						"cy": "12",
						"r": "10"
					}],
					["path", { "d": "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" }],
					["path", { "d": "M12 17h.01" }]
				],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {}, null);
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Circle_question_mark);
}
Circle_question_mark.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
// src/routes/(public)/pricing/+page.svelte
_page[FILENAME] = "src/routes/(public)/pricing/+page.svelte";
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		head("sr4236", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Business Pricing Plans | Pimple Saudagar Directory</title>`);
			});
			$$renderer.push(`<meta name="description" content="Explore transparent pricing plans for local businesses in Pimple Saudagar. Boost your neighborhood reach, leads, and customer reviews."/>`);
			push_element($$renderer, "meta", 10, 2);
			pop_element();
		});
		$$renderer.push(`<div class="min-h-screen flex flex-col bg-background">`);
		push_element($$renderer, "div", 16, 0);
		$$renderer.push(`<main class="container mx-auto px-4 py-16 max-w-6xl flex-1">`);
		push_element($$renderer, "main", 17, 2);
		$$renderer.push(`<div class="text-center max-w-2xl mx-auto mb-16">`);
		push_element($$renderer, "div", 19, 4);
		$$renderer.push(`<div class="inline-flex items-center gap-1.5 text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full mb-3">`);
		push_element($$renderer, "div", 20, 6);
		Sparkles($$renderer, { class: "h-3.5 w-3.5" });
		$$renderer.push(`<!----> <span>`);
		push_element($$renderer, "span", 22, 8);
		$$renderer.push(`TRANSPARENT NEIGHBORHOOD PRICING</span>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">`);
		push_element($$renderer, "h1", 24, 6);
		$$renderer.push(`Promote Your Business in Pimple Saudagar</h1>`);
		pop_element();
		$$renderer.push(` <p class="mt-3 text-sm text-muted-foreground">`);
		push_element($$renderer, "p", 27, 6);
		$$renderer.push(`Choose the right visibility plan to connect with thousands of local residents and high-intent customers in Kokane Chowk, Kunal Icon Rd, and Shivar Chowk.</p>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-20">`);
		push_element($$renderer, "div", 33, 4);
		$$renderer.push(`<!--[-->`);
		const each_array = ensure_array_like(data.plans);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let plan = each_array[$$index];
			const isPopular = plan.slug === "standard";
			$$renderer.push(`<div${attr_class(`relative rounded-2xl border bg-card p-8 shadow-card flex flex-col justify-between transition-all duration-300 hover:shadow-card-hover ${isPopular ? "border-primary ring-2 ring-primary/20 md:-translate-y-2" : "hover:border-primary/40"}`)}>`);
			push_element($$renderer, "div", 36, 8);
			if (isPopular) {
				$$renderer.push(`<!--[0--><div class="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow">`);
				push_element($$renderer, "div", 42, 12);
				$$renderer.push(`Most Popular</div>`);
				pop_element();
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div>`);
			push_element($$renderer, "div", 47, 10);
			$$renderer.push(`<h3 class="font-bold text-xl text-foreground">`);
			push_element($$renderer, "h3", 48, 12);
			$$renderer.push(`${escape_html(plan.name)}</h3>`);
			pop_element();
			$$renderer.push(` <p class="text-xs text-muted-foreground mt-1 min-h-[32px]">`);
			push_element($$renderer, "p", 49, 12);
			$$renderer.push(`${escape_html(plan.description)}</p>`);
			pop_element();
			$$renderer.push(` <div class="my-6 pb-6 border-b">`);
			push_element($$renderer, "div", 53, 12);
			$$renderer.push(`<span class="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">`);
			push_element($$renderer, "span", 54, 14);
			$$renderer.push(`${escape_html(plan.priceMinor === 0 ? "₹0" : `₹${(plan.priceMinor / 100).toLocaleString("en-IN")}`)}</span>`);
			pop_element();
			$$renderer.push(` <span class="text-xs text-muted-foreground font-medium ml-1.5">`);
			push_element($$renderer, "span", 59, 14);
			$$renderer.push(`${escape_html(plan.priceMinor === 0 ? "forever free" : "/ year")}</span>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
			$$renderer.push(` <ul class="space-y-3 text-xs mb-8">`);
			push_element($$renderer, "ul", 65, 12);
			$$renderer.push(`<li class="flex items-center gap-2.5">`);
			push_element($$renderer, "li", 66, 14);
			Check($$renderer, { class: "h-4 w-4 text-emerald-600 shrink-0" });
			$$renderer.push(`<!----> <span>`);
			push_element($$renderer, "span", 68, 16);
			$$renderer.push(`Up to <strong>`);
			push_element($$renderer, "strong", 68, 28);
			$$renderer.push(`${escape_html(plan.maxPhotos)}</strong>`);
			pop_element();
			$$renderer.push(` business photos</span>`);
			pop_element();
			$$renderer.push(`</li>`);
			pop_element();
			$$renderer.push(` <li class="flex items-center gap-2.5">`);
			push_element($$renderer, "li", 70, 14);
			Check($$renderer, { class: "h-4 w-4 text-emerald-600 shrink-0" });
			$$renderer.push(`<!----> <span>`);
			push_element($$renderer, "span", 72, 16);
			$$renderer.push(`Listed in up to <strong>`);
			push_element($$renderer, "strong", 72, 38);
			$$renderer.push(`${escape_html(plan.maxCategories)}</strong>`);
			pop_element();
			$$renderer.push(` categories</span>`);
			pop_element();
			$$renderer.push(`</li>`);
			pop_element();
			$$renderer.push(` <li class="flex items-center gap-2.5">`);
			push_element($$renderer, "li", 74, 14);
			Check($$renderer, { class: "h-4 w-4 text-emerald-600 shrink-0" });
			$$renderer.push(`<!----> <span>`);
			push_element($$renderer, "span", 76, 16);
			$$renderer.push(`Coverage across <strong>`);
			push_element($$renderer, "strong", 76, 38);
			$$renderer.push(`${escape_html(plan.maxLocations)}</strong>`);
			pop_element();
			$$renderer.push(` localities</span>`);
			pop_element();
			$$renderer.push(`</li>`);
			pop_element();
			$$renderer.push(` <li class="flex items-center gap-2.5">`);
			push_element($$renderer, "li", 78, 14);
			Check($$renderer, { class: "h-4 w-4 text-emerald-600 shrink-0" });
			$$renderer.push(`<!----> <span>`);
			push_element($$renderer, "span", 80, 16);
			$$renderer.push(`Direct <strong>`);
			push_element($$renderer, "strong", 80, 29);
			$$renderer.push(`Call &amp; WhatsApp</strong>`);
			pop_element();
			$$renderer.push(` action buttons</span>`);
			pop_element();
			$$renderer.push(`</li>`);
			pop_element();
			$$renderer.push(` <li class="flex items-center gap-2.5">`);
			push_element($$renderer, "li", 82, 14);
			Check($$renderer, { class: `h-4 w-4 shrink-0 ${plan.badgeVisible ? "text-emerald-600" : "text-muted-foreground/30"}` });
			$$renderer.push(`<!----> <span${attr_class(clsx(plan.badgeVisible ? "font-semibold" : "text-muted-foreground line-through"))}>`);
			push_element($$renderer, "span", 86, 16);
			$$renderer.push(`Verified Business Trust Badge</span>`);
			pop_element();
			$$renderer.push(`</li>`);
			pop_element();
			$$renderer.push(` <li class="flex items-center gap-2.5">`);
			push_element($$renderer, "li", 90, 14);
			Check($$renderer, { class: `h-4 w-4 shrink-0 ${plan.featuredAllowed ? "text-emerald-600" : "text-muted-foreground/30"}` });
			$$renderer.push(`<!----> <span${attr_class(clsx(plan.featuredAllowed ? "font-semibold text-amber-600 dark:text-amber-400" : "text-muted-foreground line-through"))}>`);
			push_element($$renderer, "span", 94, 16);
			$$renderer.push(`Homepage Spotlight &amp; Top Search Placement</span>`);
			pop_element();
			$$renderer.push(`</li>`);
			pop_element();
			$$renderer.push(`</ul>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
			$$renderer.push(` <a${attr("href", `/submit?plan=${stringify(plan.slug)}`)}${attr_class(`w-full text-center py-3 px-4 rounded-xl text-xs font-bold transition shadow-xs block ${isPopular ? "bg-primary text-primary-foreground hover:bg-primary-600" : "bg-muted hover:bg-muted/80 text-foreground"}`)}>`);
			push_element($$renderer, "a", 101, 10);
			$$renderer.push(`${escape_html(plan.priceMinor === 0 ? "List Business for Free" : `Select ${plan.name}`)}</a>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
		}
		$$renderer.push(`<!--]--></div>`);
		pop_element();
		$$renderer.push(` <div class="max-w-3xl mx-auto rounded-2xl border bg-card p-8 shadow-card">`);
		push_element($$renderer, "div", 114, 4);
		$$renderer.push(`<div class="flex items-center gap-2 mb-6 pb-3 border-b">`);
		push_element($$renderer, "div", 115, 6);
		Circle_question_mark($$renderer, { class: "h-5 w-5 text-primary" });
		$$renderer.push(`<!----> <h2 class="text-lg font-bold text-foreground">`);
		push_element($$renderer, "h2", 117, 8);
		$$renderer.push(`Frequently Asked Questions</h2>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <div class="space-y-4 text-xs">`);
		push_element($$renderer, "div", 120, 6);
		$$renderer.push(`<div>`);
		push_element($$renderer, "div", 121, 8);
		$$renderer.push(`<h4 class="font-bold text-foreground mb-1">`);
		push_element($$renderer, "h4", 122, 10);
		$$renderer.push(`How does business verification work in Pimple Saudagar?</h4>`);
		pop_element();
		$$renderer.push(` <p class="text-muted-foreground leading-relaxed">`);
		push_element($$renderer, "p", 125, 10);
		$$renderer.push(`When you claim or submit a business listing, our local moderation team verifies the physical address and contact phone in Pimple Saudagar within 24 hours before activating the Verified badge.</p>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <div class="pt-3 border-t">`);
		push_element($$renderer, "div", 130, 8);
		$$renderer.push(`<h4 class="font-bold text-foreground mb-1">`);
		push_element($$renderer, "h4", 131, 10);
		$$renderer.push(`Can I upgrade or downgrade my plan later?</h4>`);
		pop_element();
		$$renderer.push(` <p class="text-muted-foreground leading-relaxed">`);
		push_element($$renderer, "p", 134, 10);
		$$renderer.push(`Yes. You can upgrade from the Free tier to Standard or Premium at any time from your Business Owner Dashboard. Pro-rated duration is applied automatically.</p>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <div class="pt-3 border-t">`);
		push_element($$renderer, "div", 139, 8);
		$$renderer.push(`<h4 class="font-bold text-foreground mb-1">`);
		push_element($$renderer, "h4", 140, 10);
		$$renderer.push(`What payment methods are supported?</h4>`);
		pop_element();
		$$renderer.push(` <p class="text-muted-foreground leading-relaxed">`);
		push_element($$renderer, "p", 143, 10);
		$$renderer.push(`We accept UPI (Google Pay, PhonePe, Paytm), Net Banking, RuPay, and all major Indian Credit &amp; Debit Cards via our secure payment gateway.</p>`);
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