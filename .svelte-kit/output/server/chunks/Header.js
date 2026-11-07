import { D as FILENAME, E as escape_html, S as attr, b as prevent_snippet_stringification, d as sanitize_props, f as slot, g as push_element, h as pop_element, p as spread_props, s as ensure_array_like } from "./server.js";
import { t as Icon } from "./Icon.js";
// node_modules/lucide-svelte/dist/icons/globe.svelte
Globe[FILENAME] = "node_modules/lucide-svelte/dist/icons/globe.svelte";
function Globe($$renderer, $$props) {
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
			{ name: "globe" },
			$$sanitized_props,
			{
				/**
				* @component @name Globe
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8cGF0aCBkPSJNMTIgMmExNC41IDE0LjUgMCAwIDAgMCAyMCAxNC41IDE0LjUgMCAwIDAgMC0yMCIgLz4KICA8cGF0aCBkPSJNMiAxMmgyMCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/globe
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
					["path", { "d": "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" }],
					["path", { "d": "M2 12h20" }]
				],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {}, null);
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Globe);
}
Globe.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
// src/lib/i18n/translations.ts
var LOCALES = [
	{
		code: "en",
		label: "English",
		nativeName: "English"
	},
	{
		code: "mr",
		label: "Marathi",
		nativeName: "मराठी"
	},
	{
		code: "hi",
		label: "Hindi",
		nativeName: "हिंदी"
	}
];
// src/lib/components/ui/LanguageSelector.svelte
LanguageSelector[FILENAME] = "src/lib/components/ui/LanguageSelector.svelte";
function LanguageSelector($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let currentLocale = "en";
		function handleChange(event) {
			currentLocale = event.target.value;
			document.cookie = `NEXT_LOCALE=${currentLocale}; path=/; max-age=31536000; SameSite=Lax`;
		}
		$$renderer.push(`<div class="flex items-center gap-1.5 text-xs text-slate-500">`);
		push_element($$renderer, "div", 14, 0);
		Globe($$renderer, {
			class: "h-3.5 w-3.5 text-slate-400",
			"aria-hidden": "true"
		});
		$$renderer.push(`<!----> `);
		$$renderer.select({
			value: currentLocale,
			onchange: handleChange,
			"aria-label": "Select language",
			class: "rounded-md border border-slate-200 bg-transparent px-2 py-1 text-xs font-medium text-slate-700 hover:border-slate-300 focus:border-indigo-500 focus:outline-none"
		}, ($$renderer) => {
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(LOCALES);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let loc = each_array[$$index];
				$$renderer.option({ value: loc.code }, ($$renderer) => {
					push_element($$renderer, "option", 23, 6);
					$$renderer.push(`${escape_html(loc.nativeName)} (${escape_html(loc.label)})`);
					pop_element();
				});
			}
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(`</div>`);
		pop_element();
	}, LanguageSelector);
}
LanguageSelector.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
// src/lib/components/ui/Header.svelte
Header[FILENAME] = "src/lib/components/ui/Header.svelte";
function Header($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { user } = $$props;
		$$renderer.push(`<header class="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur">`);
		push_element($$renderer, "header", 8, 0);
		$$renderer.push(`<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">`);
		push_element($$renderer, "div", 9, 2);
		$$renderer.push(`<a href="/" class="flex items-center gap-3">`);
		push_element($$renderer, "a", 11, 4);
		$$renderer.push(`<div class="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-sm">`);
		push_element($$renderer, "div", 12, 6);
		$$renderer.push(`PS</div>`);
		pop_element();
		$$renderer.push(` <div>`);
		push_element($$renderer, "div", 15, 6);
		$$renderer.push(`<span class="font-extrabold tracking-tight text-base text-slate-900 block leading-none">`);
		push_element($$renderer, "span", 16, 8);
		$$renderer.push(`Pimple Saudagar</span>`);
		pop_element();
		$$renderer.push(` <span class="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">`);
		push_element($$renderer, "span", 19, 8);
		$$renderer.push(`Local Directory</span>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(`</a>`);
		pop_element();
		$$renderer.push(` <div class="flex items-center gap-4 sm:gap-6">`);
		push_element($$renderer, "div", 26, 4);
		$$renderer.push(`<nav class="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-600">`);
		push_element($$renderer, "nav", 27, 6);
		$$renderer.push(`<a href="/search" class="hover:text-indigo-600 transition">`);
		push_element($$renderer, "a", 28, 8);
		$$renderer.push(`Explore Directory</a>`);
		pop_element();
		$$renderer.push(` <a href="/pricing" class="hover:text-indigo-600 transition">`);
		push_element($$renderer, "a", 29, 8);
		$$renderer.push(`Pricing Plans</a>`);
		pop_element();
		$$renderer.push(`</nav>`);
		pop_element();
		$$renderer.push(` `);
		LanguageSelector($$renderer, {});
		$$renderer.push(`<!----> <div class="flex items-center gap-2">`);
		push_element($$renderer, "div", 34, 6);
		if (user) {
			$$renderer.push(`<!--[0--><a${attr("href", ["admin", "moderator"].includes(user.role) ? "/admin" : "/dashboard")} class="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm hover:border-slate-300 transition">`);
			push_element($$renderer, "a", 36, 10);
			$$renderer.push(`${escape_html(["admin", "moderator"].includes(user.role) ? "Admin Back-Office" : "Dashboard")}</a>`);
			pop_element();
		} else {
			$$renderer.push(`<!--[-1--><a href="/login" class="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 transition">`);
			push_element($$renderer, "a", 43, 10);
			$$renderer.push(`Sign In</a>`);
			pop_element();
		}
		$$renderer.push(`<!--]--> <a href="/pricing" class="rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition">`);
		push_element($$renderer, "a", 51, 8);
		$$renderer.push(`+ Add Business</a>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(`</header>`);
		pop_element();
	}, Header);
}
Header.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export { Globe as n, Header as t };

//# sourceMappingURL=Header.js.map