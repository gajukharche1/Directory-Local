import { D as FILENAME, E as escape_html, S as attr, b as prevent_snippet_stringification, d as sanitize_props, f as slot, g as push_element, h as pop_element, p as spread_props, s as ensure_array_like, t as attr_class } from "../../../../chunks/server.js";
import { t as page } from "../../../../chunks/state.js";
import { t as Icon } from "../../../../chunks/Icon.js";
import { t as Store } from "../../../../chunks/store.js";
import { t as Inbox } from "../../../../chunks/inbox.js";
import { t as Star } from "../../../../chunks/star.js";
import { t as Credit_card } from "../../../../chunks/credit-card.js";
import { t as Log_out } from "../../../../chunks/log-out.js";
import { t as Arrow_left } from "../../../../chunks/arrow-left.js";
// node_modules/lucide-svelte/dist/icons/layout-dashboard.svelte
Layout_dashboard[FILENAME] = "node_modules/lucide-svelte/dist/icons/layout-dashboard.svelte";
function Layout_dashboard($$renderer, $$props) {
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
			{ name: "layout-dashboard" },
			$$sanitized_props,
			{
				/**
				* @component @name LayoutDashboard
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI5IiB4PSIzIiB5PSIzIiByeD0iMSIgLz4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI1IiB4PSIxNCIgeT0iMyIgcng9IjEiIC8+CiAgPHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iOSIgeD0iMTQiIHk9IjEyIiByeD0iMSIgLz4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI1IiB4PSIzIiB5PSIxNiIgcng9IjEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/layout-dashboard
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [
					["rect", {
						"width": "7",
						"height": "9",
						"x": "3",
						"y": "3",
						"rx": "1"
					}],
					["rect", {
						"width": "7",
						"height": "5",
						"x": "14",
						"y": "3",
						"rx": "1"
					}],
					["rect", {
						"width": "7",
						"height": "9",
						"x": "14",
						"y": "12",
						"rx": "1"
					}],
					["rect", {
						"width": "7",
						"height": "5",
						"x": "3",
						"y": "16",
						"rx": "1"
					}]
				],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {}, null);
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Layout_dashboard);
}
Layout_dashboard.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
// src/routes/(account)/dashboard/+layout.svelte
_layout[FILENAME] = "src/routes/(account)/dashboard/+layout.svelte";
function _layout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, children } = $$props;
		const navItems = [
			{
				label: "Overview",
				href: "/dashboard",
				icon: Layout_dashboard
			},
			{
				label: "My Listings",
				href: "/dashboard/listings",
				icon: Store
			},
			{
				label: "Leads & Enquiries",
				href: "/dashboard/enquiries",
				icon: Inbox
			},
			{
				label: "Customer Reviews",
				href: "/dashboard/reviews",
				icon: Star
			},
			{
				label: "Plan & Billing",
				href: "/dashboard/billing",
				icon: Credit_card
			}
		];
		$$renderer.push(`<div class="min-h-screen flex flex-col md:flex-row bg-muted/20">`);
		push_element($$renderer, "div", 26, 0);
		$$renderer.push(`<aside class="w-full md:w-64 border-r bg-card flex flex-col justify-between shrink-0">`);
		push_element($$renderer, "aside", 28, 2);
		$$renderer.push(`<div>`);
		push_element($$renderer, "div", 29, 4);
		$$renderer.push(`<div class="p-4 border-b">`);
		push_element($$renderer, "div", 31, 6);
		$$renderer.push(`<a href="/" class="flex items-center gap-2">`);
		push_element($$renderer, "a", 32, 8);
		$$renderer.push(`<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm shadow-sm">`);
		push_element($$renderer, "div", 33, 10);
		$$renderer.push(`PS</div>`);
		pop_element();
		$$renderer.push(` <div>`);
		push_element($$renderer, "div", 36, 10);
		$$renderer.push(`<span class="font-bold tracking-tight text-sm text-foreground block leading-none">`);
		push_element($$renderer, "span", 37, 12);
		$$renderer.push(`Pimple Saudagar</span>`);
		pop_element();
		$$renderer.push(` <span class="text-[10px] text-muted-foreground uppercase font-semibold">`);
		push_element($$renderer, "span", 40, 12);
		$$renderer.push(`Owner Dashboard</span>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(`</a>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <div class="p-4 border-b bg-muted/30">`);
		push_element($$renderer, "div", 48, 6);
		$$renderer.push(`<p class="font-bold text-xs text-foreground truncate">`);
		push_element($$renderer, "p", 49, 8);
		$$renderer.push(`${escape_html(data.user.name)}</p>`);
		pop_element();
		$$renderer.push(` <p class="text-[11px] text-muted-foreground truncate">`);
		push_element($$renderer, "p", 50, 8);
		$$renderer.push(`${escape_html(data.user.email)}</p>`);
		pop_element();
		$$renderer.push(` <span class="inline-block mt-1.5 text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full capitalize">`);
		push_element($$renderer, "span", 51, 8);
		$$renderer.push(`${escape_html(data.user.role)} Account</span>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <nav class="p-3 space-y-1">`);
		push_element($$renderer, "nav", 57, 6);
		$$renderer.push(`<!--[-->`);
		const each_array = ensure_array_like(navItems);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let item = each_array[$$index];
			const Icon = item.icon;
			const isActive = item.href === "/dashboard" ? page.url.pathname === "/dashboard" : page.url.pathname.startsWith(item.href);
			$$renderer.push(`<a${attr("href", item.href)}${attr_class(`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition ${isActive ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`)}>`);
			push_element($$renderer, "a", 61, 10);
			if (Icon) {
				$$renderer.push("<!--[-->");
				Icon($$renderer, { class: "h-4 w-4 shrink-0" });
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
			$$renderer.push(` <span>`);
			push_element($$renderer, "span", 68, 12);
			$$renderer.push(`${escape_html(item.label)}</span>`);
			pop_element();
			$$renderer.push(`</a>`);
			pop_element();
		}
		$$renderer.push(`<!--]--></nav>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <div class="p-3 border-t space-y-1">`);
		push_element($$renderer, "div", 75, 4);
		$$renderer.push(`<a href="/" class="flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition rounded-lg hover:bg-muted">`);
		push_element($$renderer, "a", 76, 6);
		Arrow_left($$renderer, { class: "h-3.5 w-3.5" });
		$$renderer.push(`<!----> <span>`);
		push_element($$renderer, "span", 81, 8);
		$$renderer.push(`Public Directory</span>`);
		pop_element();
		$$renderer.push(`</a>`);
		pop_element();
		$$renderer.push(` <a href="/logout" class="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition rounded-lg">`);
		push_element($$renderer, "a", 84, 6);
		Log_out($$renderer, { class: "h-3.5 w-3.5" });
		$$renderer.push(`<!----> <span>`);
		push_element($$renderer, "span", 89, 8);
		$$renderer.push(`Sign Out</span>`);
		pop_element();
		$$renderer.push(`</a>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(`</aside>`);
		pop_element();
		$$renderer.push(` <main class="flex-1 p-6 md:p-8 max-w-6xl overflow-y-auto">`);
		push_element($$renderer, "main", 95, 2);
		children($$renderer);
		$$renderer.push(`<!----></main>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
	}, _layout);
}
_layout.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export { _layout as default };

//# sourceMappingURL=_layout.svelte.js.map