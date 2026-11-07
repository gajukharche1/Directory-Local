import { D as FILENAME, E as escape_html, S as attr, b as prevent_snippet_stringification, c as head, d as sanitize_props, f as slot, g as push_element, h as pop_element, p as spread_props, t as attr_class } from "../../../../chunks/server.js";
import "../../../../chunks/forms.js";
import { t as Lock } from "../../../../chunks/lock.js";
import { t as Mail } from "../../../../chunks/mail.js";
import { t as Icon } from "../../../../chunks/Icon.js";
import { t as Phone } from "../../../../chunks/phone.js";
import { t as Store } from "../../../../chunks/store.js";
import { t as Circle_alert } from "../../../../chunks/circle-alert.js";
// node_modules/lucide-svelte/dist/icons/user-check.svelte
User_check[FILENAME] = "node_modules/lucide-svelte/dist/icons/user-check.svelte";
function User_check($$renderer, $$props) {
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
			{ name: "user-check" },
			$$sanitized_props,
			{
				/**
				* @component @name UserCheck
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTYgMTEgMiAyIDQtNCIgLz4KICA8cGF0aCBkPSJNMTYgMjF2LTJhNCA0IDAgMCAwLTQtNEg2YTQgNCAwIDAgMC00IDR2MiIgLz4KICA8Y2lyY2xlIGN4PSI5IiBjeT0iNyIgcj0iNCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/user-check
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [
					["path", { "d": "m16 11 2 2 4-4" }],
					["path", { "d": "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }],
					["circle", {
						"cx": "9",
						"cy": "7",
						"r": "4"
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
	}, User_check);
}
User_check.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
// node_modules/lucide-svelte/dist/icons/user.svelte
User[FILENAME] = "node_modules/lucide-svelte/dist/icons/user.svelte";
function User($$renderer, $$props) {
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
			{ name: "user" },
			$$sanitized_props,
			{
				/**
				* @component @name User
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTkgMjF2LTJhNCA0IDAgMCAwLTQtNEg5YTQgNCAwIDAgMC00IDR2MiIgLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/user
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [["path", { "d": "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" }], ["circle", {
					"cx": "12",
					"cy": "7",
					"r": "4"
				}]],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {}, null);
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, User);
}
User.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
// src/routes/(auth)/register/+page.svelte
_page[FILENAME] = "src/routes/(auth)/register/+page.svelte";
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { form } = $$props;
		let role = "visitor";
		let isPending = false;
		head("ydeots", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Create an Account | Pimple Saudagar Directory</title>`);
			});
		});
		$$renderer.push(`<div>`);
		push_element($$renderer, "div", 16, 0);
		$$renderer.push(`<div class="mb-6">`);
		push_element($$renderer, "div", 17, 2);
		$$renderer.push(`<h2 class="text-xl font-bold tracking-tight text-foreground">`);
		push_element($$renderer, "h2", 18, 4);
		$$renderer.push(`Create your account</h2>`);
		pop_element();
		$$renderer.push(` <p class="text-xs text-muted-foreground mt-1">`);
		push_element($$renderer, "p", 19, 4);
		$$renderer.push(`Join the Pimple Saudagar local business community</p>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` `);
		if (form?.error) {
			$$renderer.push(`<!--[0--><div class="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive flex items-start gap-2">`);
			push_element($$renderer, "div", 25, 4);
			Circle_alert($$renderer, { class: "h-4 w-4 mt-0.5 shrink-0" });
			$$renderer.push(`<!----> <span>`);
			push_element($$renderer, "span", 27, 6);
			$$renderer.push(`${escape_html(form.error)}</span>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="mb-5 grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg">`);
		push_element($$renderer, "div", 32, 2);
		$$renderer.push(`<button type="button"${attr_class(`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-md transition-all bg-card text-foreground shadow-sm`)}>`);
		push_element($$renderer, "button", 33, 4);
		User_check($$renderer, { class: "h-3.5 w-3.5" });
		$$renderer.push(`<!----> <span>`);
		push_element($$renderer, "span", 41, 6);
		$$renderer.push(`Resident / Visitor</span>`);
		pop_element();
		$$renderer.push(`</button>`);
		pop_element();
		$$renderer.push(` <button type="button"${attr_class(`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-md transition-all text-muted-foreground hover:text-foreground`)}>`);
		push_element($$renderer, "button", 43, 4);
		Store($$renderer, { class: "h-3.5 w-3.5" });
		$$renderer.push(`<!----> <span>`);
		push_element($$renderer, "span", 51, 6);
		$$renderer.push(`Business Owner</span>`);
		pop_element();
		$$renderer.push(`</button>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <form method="POST" class="space-y-4">`);
		push_element($$renderer, "form", 55, 2);
		$$renderer.push(`<input type="hidden" name="role"${attr("value", role)}/>`);
		push_element($$renderer, "input", 66, 4);
		pop_element();
		$$renderer.push(` <div>`);
		push_element($$renderer, "div", 68, 4);
		$$renderer.push(`<label for="name" class="block text-xs font-semibold text-foreground mb-1">`);
		push_element($$renderer, "label", 69, 6);
		$$renderer.push(`Full Name</label>`);
		pop_element();
		$$renderer.push(` <div class="relative">`);
		push_element($$renderer, "div", 70, 6);
		User($$renderer, { class: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" });
		$$renderer.push(`<!----> <input id="name" type="text" name="name" required=""${attr("placeholder", "e.g. Pooja Sharma")} class="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary"/>`);
		push_element($$renderer, "input", 72, 8);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` `);
		if (form?.fieldErrors?.name) {
			$$renderer.push(`<!--[0--><p class="mt-1 text-xs text-destructive">`);
			push_element($$renderer, "p", 82, 8);
			$$renderer.push(`${escape_html(form.fieldErrors.name[0])}</p>`);
			pop_element();
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
		pop_element();
		$$renderer.push(` <div>`);
		push_element($$renderer, "div", 86, 4);
		$$renderer.push(`<label for="reg-email" class="block text-xs font-semibold text-foreground mb-1">`);
		push_element($$renderer, "label", 87, 6);
		$$renderer.push(`Email address</label>`);
		pop_element();
		$$renderer.push(` <div class="relative">`);
		push_element($$renderer, "div", 88, 6);
		Mail($$renderer, { class: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" });
		$$renderer.push(`<!----> <input id="reg-email" type="email" name="email" required="" placeholder="name@example.com" class="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary"/>`);
		push_element($$renderer, "input", 90, 8);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` `);
		if (form?.fieldErrors?.email) {
			$$renderer.push(`<!--[0--><p class="mt-1 text-xs text-destructive">`);
			push_element($$renderer, "p", 100, 8);
			$$renderer.push(`${escape_html(form.fieldErrors.email[0])}</p>`);
			pop_element();
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
		pop_element();
		$$renderer.push(` <div>`);
		push_element($$renderer, "div", 104, 4);
		$$renderer.push(`<label for="phone" class="block text-xs font-semibold text-foreground mb-1">`);
		push_element($$renderer, "label", 105, 6);
		$$renderer.push(`Mobile Number ${escape_html("(Optional)")}</label>`);
		pop_element();
		$$renderer.push(` <div class="relative">`);
		push_element($$renderer, "div", 108, 6);
		Phone($$renderer, { class: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" });
		$$renderer.push(`<!----> <input id="phone" type="tel" name="phone" placeholder="+919876543210"${attr("required", false, true)} class="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary"/>`);
		push_element($$renderer, "input", 110, 8);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` `);
		if (form?.fieldErrors?.phone) {
			$$renderer.push(`<!--[0--><p class="mt-1 text-xs text-destructive">`);
			push_element($$renderer, "p", 120, 8);
			$$renderer.push(`${escape_html(form.fieldErrors.phone[0])}</p>`);
			pop_element();
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
		pop_element();
		$$renderer.push(` <div>`);
		push_element($$renderer, "div", 124, 4);
		$$renderer.push(`<label for="reg-password" class="block text-xs font-semibold text-foreground mb-1">`);
		push_element($$renderer, "label", 125, 6);
		$$renderer.push(`Password</label>`);
		pop_element();
		$$renderer.push(` <div class="relative">`);
		push_element($$renderer, "div", 126, 6);
		Lock($$renderer, { class: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" });
		$$renderer.push(`<!----> <input id="reg-password" type="password" name="password" required="" placeholder="Min. 8 characters with 1 uppercase &amp; 1 number" class="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary"/>`);
		push_element($$renderer, "input", 128, 8);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` `);
		if (form?.fieldErrors?.password) {
			$$renderer.push(`<!--[0--><p class="mt-1 text-xs text-destructive">`);
			push_element($$renderer, "p", 138, 8);
			$$renderer.push(`${escape_html(form.fieldErrors.password[0])}</p>`);
			pop_element();
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
		pop_element();
		$$renderer.push(` <button type="submit"${attr("disabled", isPending, true)} class="w-full inline-flex items-center justify-center rounded-lg bg-primary py-2.5 px-4 text-sm font-semibold text-primary-foreground shadow transition hover:bg-primary-600 disabled:opacity-50">`);
		push_element($$renderer, "button", 142, 4);
		$$renderer.push(`<!--[-1--><span>`);
		push_element($$renderer, "span", 151, 8);
		$$renderer.push(`Create ${escape_html("")} Account</span>`);
		pop_element();
		$$renderer.push(`<!--]--></button>`);
		pop_element();
		$$renderer.push(`</form>`);
		pop_element();
		$$renderer.push(` <div class="mt-6 pt-4 border-t text-center text-xs text-muted-foreground">`);
		push_element($$renderer, "div", 156, 2);
		$$renderer.push(`<span>`);
		push_element($$renderer, "span", 157, 4);
		$$renderer.push(`Already registered?</span>`);
		pop_element();
		$$renderer.push(` <a href="/login" class="font-semibold text-primary hover:underline">`);
		push_element($$renderer, "a", 158, 4);
		$$renderer.push(`Sign in</a>`);
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