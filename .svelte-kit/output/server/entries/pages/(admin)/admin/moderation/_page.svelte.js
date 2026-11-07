import { D as FILENAME, E as escape_html, S as attr, b as prevent_snippet_stringification, c as head, d as sanitize_props, f as slot, g as push_element, h as pop_element, p as spread_props, s as ensure_array_like } from "../../../../../chunks/server.js";
import "../../../../../chunks/forms.js";
import { t as Star } from "../../../../../chunks/star.js";
import { t as Shield_alert } from "../../../../../chunks/shield-alert.js";
import { t as File_text } from "../../../../../chunks/file-text.js";
import { t as Building_2 } from "../../../../../chunks/building-2.js";
import { t as Calendar } from "../../../../../chunks/calendar.js";
import { t as Circle_check } from "../../../../../chunks/circle-check.js";
import { t as Check } from "../../../../../chunks/check.js";
import { t as Icon } from "../../../../../chunks/Icon.js";
// node_modules/lucide-svelte/dist/icons/loader-circle.svelte
Loader_circle[FILENAME] = "node_modules/lucide-svelte/dist/icons/loader-circle.svelte";
function Loader_circle($$renderer, $$props) {
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
			{ name: "loader-circle" },
			$$sanitized_props,
			{
				/**
				* @component @name LoaderCircle
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEgMTJhOSA5IDAgMSAxLTYuMjE5LTguNTYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/loader-circle
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [["path", { "d": "M21 12a9 9 0 1 1-6.219-8.56" }]],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {}, null);
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Loader_circle);
}
Loader_circle.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
// node_modules/lucide-svelte/dist/icons/x.svelte
X[FILENAME] = "node_modules/lucide-svelte/dist/icons/x.svelte";
function X($$renderer, $$props) {
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
			{ name: "x" },
			$$sanitized_props,
			{
				/**
				* @component @name X
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTggNiA2IDE4IiAvPgogIDxwYXRoIGQ9Im02IDYgMTIgMTIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/x
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [["path", { "d": "M18 6 6 18" }], ["path", { "d": "m6 6 12 12" }]],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {}, null);
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, X);
}
X.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
// src/routes/(admin)/admin/moderation/+page.svelte
_page[FILENAME] = "src/routes/(admin)/admin/moderation/+page.svelte";
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let pendingActionId = null;
		head("apx34g", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Content Moderation Queue | Admin Console</title>`);
			});
		});
		$$renderer.push(`<div class="space-y-10">`);
		push_element($$renderer, "div", 25, 0);
		$$renderer.push(`<div>`);
		push_element($$renderer, "div", 26, 2);
		$$renderer.push(`<h1 class="text-2xl font-bold tracking-tight text-foreground">`);
		push_element($$renderer, "h1", 27, 4);
		$$renderer.push(`Content Moderation Queue</h1>`);
		pop_element();
		$$renderer.push(` <p class="text-xs text-muted-foreground mt-0.5">`);
		push_element($$renderer, "p", 28, 4);
		$$renderer.push(`Review, approve, or reject customer ratings and business ownership verification requests</p>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <section class="space-y-4">`);
		push_element($$renderer, "section", 34, 2);
		$$renderer.push(`<div class="flex items-center justify-between pb-2 border-b">`);
		push_element($$renderer, "div", 35, 4);
		$$renderer.push(`<div class="flex items-center gap-2">`);
		push_element($$renderer, "div", 36, 6);
		Star($$renderer, { class: "h-4 w-4 text-amber-500" });
		$$renderer.push(`<!----> <h2 class="text-base font-bold text-foreground">`);
		push_element($$renderer, "h2", 38, 8);
		$$renderer.push(`Customer Reviews (${escape_html(data.pendingReviews.length)})</h2>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <span class="text-xs text-muted-foreground">`);
		push_element($$renderer, "span", 42, 6);
		$$renderer.push(`Auto-aggregates average rating on approval</span>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` `);
		if (data.pendingReviews.length === 0) {
			$$renderer.push(`<!--[0--><div class="rounded-xl border border-dashed bg-card p-8 text-center shadow-xs">`);
			push_element($$renderer, "div", 46, 6);
			Circle_check($$renderer, { class: "h-8 w-8 text-emerald-600 mx-auto mb-2" });
			$$renderer.push(`<!----> <p class="text-xs font-semibold text-foreground">`);
			push_element($$renderer, "p", 48, 8);
			$$renderer.push(`All customer reviews are moderated</p>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
		} else {
			$$renderer.push(`<!--[-1--><div class="space-y-3">`);
			push_element($$renderer, "div", 51, 6);
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(data.pendingReviews);
			for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
				let rev = each_array[$$index_1];
				$$renderer.push(`<div class="rounded-xl border bg-card p-5 shadow-card space-y-3">`);
				push_element($$renderer, "div", 53, 10);
				$$renderer.push(`<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b">`);
				push_element($$renderer, "div", 54, 12);
				$$renderer.push(`<div class="flex items-center gap-3">`);
				push_element($$renderer, "div", 55, 14);
				$$renderer.push(`<div class="flex items-center gap-0.5">`);
				push_element($$renderer, "div", 56, 16);
				$$renderer.push(`<!--[-->`);
				const each_array_1 = ensure_array_like(Array.from({ length: rev.rating }));
				for (let $$index = 0, $$length = each_array_1.length; $$index < $$length; $$index++) {
					each_array_1[$$index];
					Star($$renderer, { class: "h-3.5 w-3.5 fill-amber-400 text-amber-400" });
				}
				$$renderer.push(`<!--]--></div>`);
				pop_element();
				$$renderer.push(` <span class="font-bold text-sm text-foreground">`);
				push_element($$renderer, "span", 61, 16);
				$$renderer.push(`${escape_html(rev.reviewerName)}</span>`);
				pop_element();
				$$renderer.push(` <span class="text-xs text-muted-foreground">`);
				push_element($$renderer, "span", 62, 16);
				$$renderer.push(`(Hashed: ${escape_html(rev.reviewerEmailHash.substring(0, 10))}...)</span>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(` <div class="flex items-center gap-2 text-xs text-muted-foreground">`);
				push_element($$renderer, "div", 67, 14);
				$$renderer.push(`<div class="flex items-center gap-1 bg-muted px-2 py-0.5 rounded font-medium text-foreground">`);
				push_element($$renderer, "div", 68, 16);
				Building_2($$renderer, { class: "h-3 w-3 text-primary" });
				$$renderer.push(`<!----> <span>`);
				push_element($$renderer, "span", 70, 18);
				$$renderer.push(`${escape_html(rev.listing.title)}</span>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(` <span>`);
				push_element($$renderer, "span", 72, 16);
				$$renderer.push(`•</span>`);
				pop_element();
				$$renderer.push(` <div class="flex items-center gap-1">`);
				push_element($$renderer, "div", 73, 16);
				Calendar($$renderer, { class: "h-3 w-3" });
				$$renderer.push(`<!----> <span>`);
				push_element($$renderer, "span", 75, 18);
				$$renderer.push(`${escape_html(new Date(rev.createdAt).toLocaleString())}</span>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(` <div>`);
				push_element($$renderer, "div", 80, 12);
				$$renderer.push(`<h4 class="font-bold text-xs text-foreground mb-1">`);
				push_element($$renderer, "h4", 81, 14);
				$$renderer.push(`${escape_html(rev.title)}</h4>`);
				pop_element();
				$$renderer.push(` <p class="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">`);
				push_element($$renderer, "p", 82, 14);
				$$renderer.push(`${escape_html(rev.body)}</p>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(` <div class="pt-2 border-t flex justify-end gap-2">`);
				push_element($$renderer, "div", 87, 12);
				$$renderer.push(`<form method="POST" action="?/approveReview">`);
				push_element($$renderer, "form", 88, 14);
				$$renderer.push(`<input type="hidden" name="reviewId"${attr("value", rev.id)}/>`);
				push_element($$renderer, "input", 99, 16);
				pop_element();
				$$renderer.push(` <button type="submit"${attr("disabled", pendingActionId === `approve-${rev.id}`, true)} class="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-emerald-700 transition disabled:opacity-50">`);
				push_element($$renderer, "button", 100, 16);
				if (pendingActionId === `approve-${rev.id}`) {
					$$renderer.push("<!--[0-->");
					Loader_circle($$renderer, { class: "h-3 w-3 animate-spin" });
				} else {
					$$renderer.push("<!--[-1-->");
					Check($$renderer, { class: "h-3 w-3" });
				}
				$$renderer.push(`<!--]--> <span>`);
				push_element($$renderer, "span", 110, 18);
				$$renderer.push(`Approve</span>`);
				pop_element();
				$$renderer.push(`</button>`);
				pop_element();
				$$renderer.push(`</form>`);
				pop_element();
				$$renderer.push(` <form method="POST" action="?/rejectReview">`);
				push_element($$renderer, "form", 114, 14);
				$$renderer.push(`<input type="hidden" name="reviewId"${attr("value", rev.id)}/>`);
				push_element($$renderer, "input", 125, 16);
				pop_element();
				$$renderer.push(` <button type="submit"${attr("disabled", pendingActionId === `reject-${rev.id}`, true)} class="inline-flex items-center gap-1 rounded-lg bg-destructive px-3 py-1.5 text-xs font-semibold text-destructive-foreground shadow hover:bg-destructive/90 transition disabled:opacity-50">`);
				push_element($$renderer, "button", 126, 16);
				X($$renderer, { class: "h-3 w-3" });
				$$renderer.push(`<!----> <span>`);
				push_element($$renderer, "span", 132, 18);
				$$renderer.push(`Reject / Spam</span>`);
				pop_element();
				$$renderer.push(`</button>`);
				pop_element();
				$$renderer.push(`</form>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
			}
			$$renderer.push(`<!--]--></div>`);
			pop_element();
		}
		$$renderer.push(`<!--]--></section>`);
		pop_element();
		$$renderer.push(` <section class="space-y-4">`);
		push_element($$renderer, "section", 143, 2);
		$$renderer.push(`<div class="flex items-center justify-between pb-2 border-b">`);
		push_element($$renderer, "div", 144, 4);
		$$renderer.push(`<div class="flex items-center gap-2">`);
		push_element($$renderer, "div", 145, 6);
		Shield_alert($$renderer, { class: "h-4 w-4 text-blue-500" });
		$$renderer.push(`<!----> <h2 class="text-base font-bold text-foreground">`);
		push_element($$renderer, "h2", 147, 8);
		$$renderer.push(`Ownership Verification Claims (${escape_html(data.pendingClaims.length)})</h2>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <span class="text-xs text-muted-foreground">`);
		push_element($$renderer, "span", 151, 6);
		$$renderer.push(`Assigns ownership on approval</span>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` `);
		if (data.pendingClaims.length === 0) {
			$$renderer.push(`<!--[0--><div class="rounded-xl border border-dashed bg-card p-8 text-center shadow-xs">`);
			push_element($$renderer, "div", 155, 6);
			Circle_check($$renderer, { class: "h-8 w-8 text-emerald-600 mx-auto mb-2" });
			$$renderer.push(`<!----> <p class="text-xs font-semibold text-foreground">`);
			push_element($$renderer, "p", 157, 8);
			$$renderer.push(`No pending ownership claims</p>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
		} else {
			$$renderer.push(`<!--[-1--><div class="space-y-3">`);
			push_element($$renderer, "div", 160, 6);
			$$renderer.push(`<!--[-->`);
			const each_array_2 = ensure_array_like(data.pendingClaims);
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				let claim = each_array_2[$$index_2];
				$$renderer.push(`<div class="rounded-xl border bg-card p-5 shadow-card space-y-3">`);
				push_element($$renderer, "div", 162, 10);
				$$renderer.push(`<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b">`);
				push_element($$renderer, "div", 163, 12);
				$$renderer.push(`<div>`);
				push_element($$renderer, "div", 164, 14);
				$$renderer.push(`<h3 class="font-bold text-sm text-foreground">`);
				push_element($$renderer, "h3", 165, 16);
				$$renderer.push(`${escape_html(claim.listing.title)}</h3>`);
				pop_element();
				$$renderer.push(` <span class="text-xs text-muted-foreground">`);
				push_element($$renderer, "span", 166, 16);
				$$renderer.push(`${escape_html(claim.listing.locality)}</span>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(` <div class="flex items-center gap-1 text-xs text-muted-foreground">`);
				push_element($$renderer, "div", 169, 14);
				Calendar($$renderer, { class: "h-3.5 w-3.5" });
				$$renderer.push(`<!----> <span>`);
				push_element($$renderer, "span", 171, 16);
				$$renderer.push(`${escape_html(new Date(claim.createdAt).toLocaleString())}</span>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(` <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-muted/30 p-3 rounded-lg">`);
				push_element($$renderer, "div", 176, 12);
				$$renderer.push(`<div>`);
				push_element($$renderer, "div", 177, 14);
				$$renderer.push(`<span class="text-muted-foreground block text-[11px]">`);
				push_element($$renderer, "span", 178, 16);
				$$renderer.push(`Claimant</span>`);
				pop_element();
				$$renderer.push(` <span class="font-semibold text-foreground">`);
				push_element($$renderer, "span", 179, 16);
				$$renderer.push(`${escape_html(claim.user.name)}</span>`);
				pop_element();
				$$renderer.push(` <span class="text-muted-foreground block text-[11px]">`);
				push_element($$renderer, "span", 180, 16);
				$$renderer.push(`${escape_html(claim.user.email)}</span>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(` <div>`);
				push_element($$renderer, "div", 183, 14);
				$$renderer.push(`<span class="text-muted-foreground block text-[11px]">`);
				push_element($$renderer, "span", 184, 16);
				$$renderer.push(`Claimant Phone</span>`);
				pop_element();
				$$renderer.push(` <span class="font-semibold text-foreground">`);
				push_element($$renderer, "span", 185, 16);
				$$renderer.push(`${escape_html(claim.user.phone || "Not provided")}</span>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(` <div class="text-xs flex items-center gap-2">`);
				push_element($$renderer, "div", 190, 12);
				File_text($$renderer, { class: "h-4 w-4 text-primary shrink-0" });
				$$renderer.push(`<!----> <span class="font-medium text-foreground">`);
				push_element($$renderer, "span", 192, 14);
				$$renderer.push(`Proof Document:</span>`);
				pop_element();
				$$renderer.push(` <a${attr("href", claim.proofFileUrl)} target="_blank" rel="noopener noreferrer" class="text-primary font-semibold hover:underline truncate max-w-md">`);
				push_element($$renderer, "a", 193, 14);
				$$renderer.push(`${escape_html(claim.proofFileUrl)}</a>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(` `);
				if (claim.note) {
					$$renderer.push(`<!--[0--><div class="text-xs bg-muted/20 p-2.5 rounded-lg border border-dashed text-muted-foreground">`);
					push_element($$renderer, "div", 204, 14);
					$$renderer.push(`<span class="font-semibold text-foreground block mb-0.5">`);
					push_element($$renderer, "span", 205, 16);
					$$renderer.push(`Claimant Note:</span>`);
					pop_element();
					$$renderer.push(` ${escape_html(claim.note)}</div>`);
					pop_element();
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <div class="pt-2 border-t flex justify-end gap-2">`);
				push_element($$renderer, "div", 210, 12);
				$$renderer.push(`<form method="POST" action="?/approveClaim">`);
				push_element($$renderer, "form", 211, 14);
				$$renderer.push(`<input type="hidden" name="claimId"${attr("value", claim.id)}/>`);
				push_element($$renderer, "input", 222, 16);
				pop_element();
				$$renderer.push(` <button type="submit"${attr("disabled", pendingActionId === `approveClaim-${claim.id}`, true)} class="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-emerald-700 transition disabled:opacity-50">`);
				push_element($$renderer, "button", 223, 16);
				if (pendingActionId === `approveClaim-${claim.id}`) {
					$$renderer.push("<!--[0-->");
					Loader_circle($$renderer, { class: "h-3 w-3 animate-spin" });
				} else {
					$$renderer.push("<!--[-1-->");
					Check($$renderer, { class: "h-3 w-3" });
				}
				$$renderer.push(`<!--]--> <span>`);
				push_element($$renderer, "span", 233, 18);
				$$renderer.push(`Verify &amp; Approve</span>`);
				pop_element();
				$$renderer.push(`</button>`);
				pop_element();
				$$renderer.push(`</form>`);
				pop_element();
				$$renderer.push(` <form method="POST" action="?/rejectClaim">`);
				push_element($$renderer, "form", 237, 14);
				$$renderer.push(`<input type="hidden" name="claimId"${attr("value", claim.id)}/>`);
				push_element($$renderer, "input", 248, 16);
				pop_element();
				$$renderer.push(` <button type="submit"${attr("disabled", pendingActionId === `rejectClaim-${claim.id}`, true)} class="inline-flex items-center gap-1 rounded-lg bg-destructive px-3 py-1.5 text-xs font-semibold text-destructive-foreground shadow hover:bg-destructive/90 transition disabled:opacity-50">`);
				push_element($$renderer, "button", 249, 16);
				X($$renderer, { class: "h-3 w-3" });
				$$renderer.push(`<!----> <span>`);
				push_element($$renderer, "span", 255, 18);
				$$renderer.push(`Reject</span>`);
				pop_element();
				$$renderer.push(`</button>`);
				pop_element();
				$$renderer.push(`</form>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
			}
			$$renderer.push(`<!--]--></div>`);
			pop_element();
		}
		$$renderer.push(`<!--]--></section>`);
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