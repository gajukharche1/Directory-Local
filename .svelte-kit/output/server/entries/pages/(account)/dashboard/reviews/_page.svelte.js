import { D as FILENAME, E as escape_html, S as attr, b as prevent_snippet_stringification, c as head, d as sanitize_props, f as slot, g as push_element, h as pop_element, p as spread_props, s as ensure_array_like, t as attr_class } from "../../../../../chunks/server.js";
import "../../../../../chunks/forms.js";
import { t as Star } from "../../../../../chunks/star.js";
import { t as Icon } from "../../../../../chunks/Icon.js";
import { t as Building_2 } from "../../../../../chunks/building-2.js";
import { t as Calendar } from "../../../../../chunks/calendar.js";
// node_modules/lucide-svelte/dist/icons/message-square.svelte
Message_square[FILENAME] = "node_modules/lucide-svelte/dist/icons/message-square.svelte";
function Message_square($$renderer, $$props) {
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
			{ name: "message-square" },
			$$sanitized_props,
			{
				/**
				* @component @name MessageSquare
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjIgMTdhMiAyIDAgMCAxLTIgMkg2LjgyOGEyIDIgMCAwIDAtMS40MTQuNTg2bC0yLjIwMiAyLjIwMkEuNzEuNzEgMCAwIDEgMiAyMS4yODZWNWEyIDIgMCAwIDEgMi0yaDE2YTIgMiAwIDAgMSAyIDJ6IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/message-square
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [["path", { "d": "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" }]],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {}, null);
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Message_square);
}
Message_square.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
// src/routes/(account)/dashboard/reviews/+page.svelte
_page[FILENAME] = "src/routes/(account)/dashboard/reviews/+page.svelte";
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		let activeReplyId = null;
		let isSubmitting = false;
		head("wppdt8", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Customer Reviews | Business Dashboard</title>`);
			});
		});
		$$renderer.push(`<div class="space-y-6">`);
		push_element($$renderer, "div", 16, 0);
		$$renderer.push(`<div>`);
		push_element($$renderer, "div", 17, 2);
		$$renderer.push(`<h1 class="text-2xl font-bold tracking-tight text-foreground">`);
		push_element($$renderer, "h1", 18, 4);
		$$renderer.push(`Customer Reviews</h1>`);
		pop_element();
		$$renderer.push(` <p class="text-xs text-muted-foreground mt-0.5">`);
		push_element($$renderer, "p", 19, 4);
		$$renderer.push(`Read neighbor ratings and submit official owner replies to customer feedback</p>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` `);
		if (data.reviews.length === 0) {
			$$renderer.push(`<!--[0--><div class="rounded-xl border border-dashed bg-card p-12 text-center shadow-card">`);
			push_element($$renderer, "div", 25, 4);
			Star($$renderer, { class: "h-10 w-10 mx-auto text-muted-foreground/60 mb-2" });
			$$renderer.push(`<!----> <h3 class="font-bold text-sm text-foreground">`);
			push_element($$renderer, "h3", 27, 6);
			$$renderer.push(`No customer reviews yet</h3>`);
			pop_element();
			$$renderer.push(` <p class="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">`);
			push_element($$renderer, "p", 28, 6);
			$$renderer.push(`Reviews left by verified neighborhood residents will appear here for you to read and reply.</p>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
		} else {
			$$renderer.push(`<!--[-1--><div class="space-y-4">`);
			push_element($$renderer, "div", 33, 4);
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(data.reviews);
			for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
				let rev = each_array[$$index_1];
				$$renderer.push(`<div class="rounded-xl border bg-card p-5 shadow-card space-y-3">`);
				push_element($$renderer, "div", 35, 8);
				$$renderer.push(`<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b">`);
				push_element($$renderer, "div", 36, 10);
				$$renderer.push(`<div class="flex items-center gap-3">`);
				push_element($$renderer, "div", 37, 12);
				$$renderer.push(`<div class="flex items-center gap-0.5">`);
				push_element($$renderer, "div", 38, 14);
				$$renderer.push(`<!--[-->`);
				const each_array_1 = ensure_array_like(Array.from({ length: rev.rating }));
				for (let $$index = 0, $$length = each_array_1.length; $$index < $$length; $$index++) {
					each_array_1[$$index];
					Star($$renderer, { class: "h-3.5 w-3.5 fill-amber-400 text-amber-400" });
				}
				$$renderer.push(`<!--]--></div>`);
				pop_element();
				$$renderer.push(` <span class="font-bold text-sm text-foreground">`);
				push_element($$renderer, "span", 43, 14);
				$$renderer.push(`${escape_html(rev.reviewerName)}</span>`);
				pop_element();
				$$renderer.push(` <span${attr_class(`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${rev.status === "approved" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"}`)}>`);
				push_element($$renderer, "span", 44, 14);
				$$renderer.push(`${escape_html(rev.status)}</span>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(` <div class="flex items-center gap-2 text-xs text-muted-foreground">`);
				push_element($$renderer, "div", 53, 12);
				$$renderer.push(`<div class="flex items-center gap-1 font-medium text-foreground bg-muted px-2 py-0.5 rounded">`);
				push_element($$renderer, "div", 54, 14);
				Building_2($$renderer, { class: "h-3 w-3 text-primary" });
				$$renderer.push(`<!----> <span>`);
				push_element($$renderer, "span", 56, 16);
				$$renderer.push(`${escape_html(rev.listing.title)}</span>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(` <span>`);
				push_element($$renderer, "span", 58, 14);
				$$renderer.push(`•</span>`);
				pop_element();
				$$renderer.push(` <div class="flex items-center gap-1">`);
				push_element($$renderer, "div", 59, 14);
				Calendar($$renderer, { class: "h-3 w-3" });
				$$renderer.push(`<!----> <span>`);
				push_element($$renderer, "span", 61, 16);
				$$renderer.push(`${escape_html(new Date(rev.createdAt).toLocaleDateString())}</span>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(` <div>`);
				push_element($$renderer, "div", 66, 10);
				$$renderer.push(`<h4 class="font-bold text-xs text-foreground mb-1">`);
				push_element($$renderer, "h4", 67, 12);
				$$renderer.push(`${escape_html(rev.title)}</h4>`);
				pop_element();
				$$renderer.push(` <p class="text-xs text-muted-foreground leading-relaxed">`);
				push_element($$renderer, "p", 68, 12);
				$$renderer.push(`${escape_html(rev.body)}</p>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(` `);
				if (rev.ownerReply) {
					$$renderer.push(`<!--[0--><div class="rounded-lg bg-muted/60 p-3 text-xs border-l-2 border-primary space-y-1">`);
					push_element($$renderer, "div", 73, 12);
					$$renderer.push(`<div class="flex items-center justify-between">`);
					push_element($$renderer, "div", 74, 14);
					$$renderer.push(`<span class="font-semibold text-foreground text-[11px]">`);
					push_element($$renderer, "span", 75, 16);
					$$renderer.push(`Your Response:</span>`);
					pop_element();
					$$renderer.push(` `);
					if (rev.ownerReplyAt) {
						$$renderer.push(`<!--[0--><span class="text-[10px] text-muted-foreground">`);
						push_element($$renderer, "span", 77, 18);
						$$renderer.push(`${escape_html(new Date(rev.ownerReplyAt).toLocaleDateString())}</span>`);
						pop_element();
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div>`);
					pop_element();
					$$renderer.push(` <p class="text-muted-foreground">`);
					push_element($$renderer, "p", 82, 14);
					$$renderer.push(`${escape_html(rev.ownerReply)}</p>`);
					pop_element();
					$$renderer.push(`</div>`);
					pop_element();
				} else if (activeReplyId === rev.id) {
					$$renderer.push(`<!--[1--><form method="POST" action="?/reply" class="pt-2 border-t space-y-2">`);
					push_element($$renderer, "form", 85, 12);
					$$renderer.push(`<input type="hidden" name="reviewId"${attr("value", rev.id)}/>`);
					push_element($$renderer, "input", 98, 14);
					pop_element();
					$$renderer.push(` <textarea name="replyText" required="" rows="2" placeholder="Write a professional and polite response to this customer review..." class="w-full rounded-lg border bg-background px-3 py-2 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y">`);
					push_element($$renderer, "textarea", 99, 14);
					$$renderer.push(`</textarea>`);
					pop_element();
					$$renderer.push(` <div class="flex items-center gap-2">`);
					push_element($$renderer, "div", 106, 14);
					$$renderer.push(`<button type="submit"${attr("disabled", isSubmitting, true)} class="rounded-lg bg-primary py-1.5 px-3 text-xs font-semibold text-primary-foreground shadow hover:bg-primary-600 transition disabled:opacity-50 inline-flex items-center gap-1">`);
					push_element($$renderer, "button", 107, 16);
					$$renderer.push(`<!--[-1--><span>`);
					push_element($$renderer, "span", 116, 20);
					$$renderer.push(`Post Response</span>`);
					pop_element();
					$$renderer.push(`<!--]--></button>`);
					pop_element();
					$$renderer.push(` <button type="button" class="text-xs text-muted-foreground hover:text-foreground py-1.5 px-2">`);
					push_element($$renderer, "button", 119, 16);
					$$renderer.push(`Cancel</button>`);
					pop_element();
					$$renderer.push(`</div>`);
					pop_element();
					$$renderer.push(`</form>`);
					pop_element();
				} else {
					$$renderer.push(`<!--[-1--><button type="button" class="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">`);
					push_element($$renderer, "button", 129, 12);
					Message_square($$renderer, { class: "h-3.5 w-3.5" });
					$$renderer.push(`<!----> <span>`);
					push_element($$renderer, "span", 135, 14);
					$$renderer.push(`Reply as Business Owner</span>`);
					pop_element();
					$$renderer.push(`</button>`);
					pop_element();
				}
				$$renderer.push(`<!--]--></div>`);
				pop_element();
			}
			$$renderer.push(`<!--]--></div>`);
			pop_element();
		}
		$$renderer.push(`<!--]--></div>`);
		pop_element();
	}, _page);
}
_page.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map