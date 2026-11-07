import { D as FILENAME, E as escape_html, S as attr, b as prevent_snippet_stringification, c as head, d as sanitize_props, f as slot, g as push_element, h as pop_element, m as stringify, p as spread_props, s as ensure_array_like, t as attr_class } from "../../../../chunks/server.js";
import { t as Store } from "../../../../chunks/store.js";
import { t as Icon } from "../../../../chunks/Icon.js";
import { t as Inbox } from "../../../../chunks/inbox.js";
import { t as Star } from "../../../../chunks/star.js";
import { t as Arrow_right } from "../../../../chunks/arrow-right.js";
import { t as Sparkles } from "../../../../chunks/sparkles.js";
import { t as External_link } from "../../../../chunks/external-link.js";
// node_modules/lucide-svelte/dist/icons/eye.svelte
Eye[FILENAME] = "node_modules/lucide-svelte/dist/icons/eye.svelte";
function Eye($$renderer, $$props) {
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
			{ name: "eye" },
			$$sanitized_props,
			{
				/**
				* @component @name Eye
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMi4wNjIgMTIuMzQ4YTEgMSAwIDAgMSAwLS42OTYgMTAuNzUgMTAuNzUgMCAwIDEgMTkuODc2IDAgMSAxIDAgMCAxIDAgLjY5NiAxMC43NSAxMC43NSAwIDAgMS0xOS44NzYgMCIgLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIzIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/eye
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [["path", { "d": "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" }], ["circle", {
					"cx": "12",
					"cy": "12",
					"r": "3"
				}]],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {}, null);
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Eye);
}
Eye.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
// src/routes/(account)/dashboard/+page.svelte
_page[FILENAME] = "src/routes/(account)/dashboard/+page.svelte";
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		head("1597i86", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Dashboard Overview | Pimple Saudagar Directory</title>`);
			});
		});
		$$renderer.push(`<div class="space-y-8">`);
		push_element($$renderer, "div", 12, 0);
		$$renderer.push(`<div>`);
		push_element($$renderer, "div", 14, 2);
		$$renderer.push(`<h1 class="text-2xl font-bold tracking-tight text-foreground">`);
		push_element($$renderer, "h1", 15, 4);
		$$renderer.push(`Welcome back, Owner</h1>`);
		pop_element();
		$$renderer.push(` <p class="text-xs text-muted-foreground mt-1">`);
		push_element($$renderer, "p", 18, 4);
		$$renderer.push(`Here is your business performance summary in Pimple Saudagar</p>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">`);
		push_element($$renderer, "div", 24, 2);
		$$renderer.push(`<div class="rounded-xl border bg-card p-5 shadow-card">`);
		push_element($$renderer, "div", 25, 4);
		$$renderer.push(`<div class="flex items-center justify-between">`);
		push_element($$renderer, "div", 26, 6);
		$$renderer.push(`<span class="text-xs font-semibold text-muted-foreground">`);
		push_element($$renderer, "span", 27, 8);
		$$renderer.push(`My Listings</span>`);
		pop_element();
		$$renderer.push(` <div class="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">`);
		push_element($$renderer, "div", 28, 8);
		Store($$renderer, { class: "h-4 w-4" });
		$$renderer.push(`<!----></div>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <p class="text-2xl font-extrabold text-foreground mt-3">`);
		push_element($$renderer, "p", 32, 6);
		$$renderer.push(`${escape_html(data.listings.length)}</p>`);
		pop_element();
		$$renderer.push(` <span class="text-[11px] text-muted-foreground mt-0.5 block">`);
		push_element($$renderer, "span", 33, 6);
		$$renderer.push(`Active directory profiles</span>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <div class="rounded-xl border bg-card p-5 shadow-card">`);
		push_element($$renderer, "div", 36, 4);
		$$renderer.push(`<div class="flex items-center justify-between">`);
		push_element($$renderer, "div", 37, 6);
		$$renderer.push(`<span class="text-xs font-semibold text-muted-foreground">`);
		push_element($$renderer, "span", 38, 8);
		$$renderer.push(`Total Views</span>`);
		pop_element();
		$$renderer.push(` <div class="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">`);
		push_element($$renderer, "div", 39, 8);
		Eye($$renderer, { class: "h-4 w-4" });
		$$renderer.push(`<!----></div>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <p class="text-2xl font-extrabold text-foreground mt-3">`);
		push_element($$renderer, "p", 43, 6);
		$$renderer.push(`${escape_html(data.totalViews.toLocaleString())}</p>`);
		pop_element();
		$$renderer.push(` <span class="text-[11px] text-muted-foreground mt-0.5 block">`);
		push_element($$renderer, "span", 44, 6);
		$$renderer.push(`Resident profile views</span>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <div class="rounded-xl border bg-card p-5 shadow-card">`);
		push_element($$renderer, "div", 47, 4);
		$$renderer.push(`<div class="flex items-center justify-between">`);
		push_element($$renderer, "div", 48, 6);
		$$renderer.push(`<span class="text-xs font-semibold text-muted-foreground">`);
		push_element($$renderer, "span", 49, 8);
		$$renderer.push(`Customer Leads</span>`);
		pop_element();
		$$renderer.push(` <div class="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">`);
		push_element($$renderer, "div", 50, 8);
		Inbox($$renderer, { class: "h-4 w-4" });
		$$renderer.push(`<!----></div>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <p class="text-2xl font-extrabold text-foreground mt-3">`);
		push_element($$renderer, "p", 54, 6);
		$$renderer.push(`${escape_html(data.enquiries.length)}</p>`);
		pop_element();
		$$renderer.push(` <span class="text-[11px] text-emerald-600 font-semibold mt-0.5 block">`);
		push_element($$renderer, "span", 55, 6);
		$$renderer.push(`${escape_html(data.unreadEnquiries)} new unread enquiries</span>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <div class="rounded-xl border bg-card p-5 shadow-card">`);
		push_element($$renderer, "div", 60, 4);
		$$renderer.push(`<div class="flex items-center justify-between">`);
		push_element($$renderer, "div", 61, 6);
		$$renderer.push(`<span class="text-xs font-semibold text-muted-foreground">`);
		push_element($$renderer, "span", 62, 8);
		$$renderer.push(`Reviews</span>`);
		pop_element();
		$$renderer.push(` <div class="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">`);
		push_element($$renderer, "div", 63, 8);
		Star($$renderer, { class: "h-4 w-4" });
		$$renderer.push(`<!----></div>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <p class="text-2xl font-extrabold text-foreground mt-3">`);
		push_element($$renderer, "p", 67, 6);
		$$renderer.push(`${escape_html(data.totalReviews)}</p>`);
		pop_element();
		$$renderer.push(` <span class="text-[11px] text-muted-foreground mt-0.5 block">`);
		push_element($$renderer, "span", 68, 6);
		$$renderer.push(`Verified neighbor ratings</span>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">`);
		push_element($$renderer, "div", 73, 2);
		$$renderer.push(`<div class="lg:col-span-2 rounded-xl border bg-card p-6 shadow-card space-y-4">`);
		push_element($$renderer, "div", 75, 4);
		$$renderer.push(`<div class="flex items-center justify-between pb-3 border-b">`);
		push_element($$renderer, "div", 76, 6);
		$$renderer.push(`<div>`);
		push_element($$renderer, "div", 77, 8);
		$$renderer.push(`<h3 class="font-bold text-base text-foreground">`);
		push_element($$renderer, "h3", 78, 10);
		$$renderer.push(`Your Business Listings</h3>`);
		pop_element();
		$$renderer.push(` <p class="text-xs text-muted-foreground mt-0.5">`);
		push_element($$renderer, "p", 79, 10);
		$$renderer.push(`Profiles managed under this account</p>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <a href="/dashboard/listings" class="text-xs font-semibold text-primary hover:underline flex items-center gap-1">`);
		push_element($$renderer, "a", 83, 8);
		$$renderer.push(`<span>`);
		push_element($$renderer, "span", 87, 10);
		$$renderer.push(`View All</span>`);
		pop_element();
		$$renderer.push(` `);
		Arrow_right($$renderer, { class: "h-3 w-3" });
		$$renderer.push(`<!----></a>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` `);
		if (data.listings.length === 0) {
			$$renderer.push(`<!--[0--><div class="py-8 text-center">`);
			push_element($$renderer, "div", 93, 8);
			$$renderer.push(`<p class="text-xs text-muted-foreground">`);
			push_element($$renderer, "p", 94, 10);
			$$renderer.push(`No listings managed yet.</p>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
		} else {
			$$renderer.push(`<!--[-1--><div class="divide-y divide-border">`);
			push_element($$renderer, "div", 97, 8);
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(data.listings);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let listing = each_array[$$index];
				$$renderer.push(`<div class="py-3 flex items-center justify-between gap-4">`);
				push_element($$renderer, "div", 99, 12);
				$$renderer.push(`<div class="min-w-0">`);
				push_element($$renderer, "div", 100, 14);
				$$renderer.push(`<a${attr("href", `/listing/${stringify(listing.slug)}`)} target="_blank" class="font-semibold text-xs text-foreground hover:text-primary transition truncate block">`);
				push_element($$renderer, "a", 101, 16);
				$$renderer.push(`${escape_html(listing.title)}</a>`);
				pop_element();
				$$renderer.push(` <span class="text-[11px] text-muted-foreground">`);
				push_element($$renderer, "span", 108, 16);
				$$renderer.push(`${escape_html(listing.locality)} • ${escape_html(listing.plan?.name || "Free Tier")}</span>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(` <div class="flex items-center gap-2">`);
				push_element($$renderer, "div", 112, 14);
				$$renderer.push(`<span${attr_class(`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${listing.status === "published" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"}`)}>`);
				push_element($$renderer, "span", 113, 16);
				$$renderer.push(`${escape_html(listing.status.replace("_", " "))}</span>`);
				pop_element();
				$$renderer.push(` <a${attr("href", `/listing/${stringify(listing.slug)}`)} target="_blank" class="text-muted-foreground hover:text-foreground" aria-label="View live listing">`);
				push_element($$renderer, "a", 120, 16);
				External_link($$renderer, { class: "h-3.5 w-3.5" });
				$$renderer.push(`<!----></a>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
			}
			$$renderer.push(`<!--]--></div>`);
			pop_element();
		}
		$$renderer.push(`<!--]--></div>`);
		pop_element();
		$$renderer.push(` <div class="rounded-xl border bg-gradient-to-br from-primary/10 via-background to-card p-6 shadow-card flex flex-col justify-between">`);
		push_element($$renderer, "div", 136, 4);
		$$renderer.push(`<div class="space-y-3">`);
		push_element($$renderer, "div", 137, 6);
		$$renderer.push(`<div class="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/20 px-2.5 py-1 rounded-full">`);
		push_element($$renderer, "div", 138, 8);
		Sparkles($$renderer, { class: "h-3.5 w-3.5" });
		$$renderer.push(`<!----> <span>`);
		push_element($$renderer, "span", 140, 10);
		$$renderer.push(`BOOST VISIBILITY</span>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <h4 class="font-bold text-base text-foreground">`);
		push_element($$renderer, "h4", 142, 8);
		$$renderer.push(`Reach More Local Customers</h4>`);
		pop_element();
		$$renderer.push(` <p class="text-xs text-muted-foreground leading-relaxed">`);
		push_element($$renderer, "p", 145, 8);
		$$renderer.push(`Upgrade to Standard or Premium to appear in featured carousels, show top-ranked search results, and receive direct WhatsApp customer leads.</p>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <div class="pt-6">`);
		push_element($$renderer, "div", 150, 6);
		$$renderer.push(`<a href="/pricing" class="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-lg bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary-600 transition shadow-xs">`);
		push_element($$renderer, "a", 151, 8);
		$$renderer.push(`<span>`);
		push_element($$renderer, "span", 155, 10);
		$$renderer.push(`View Promotion Plans</span>`);
		pop_element();
		$$renderer.push(` `);
		Arrow_right($$renderer, { class: "h-3.5 w-3.5" });
		$$renderer.push(`<!----></a>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(`</div>`);
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