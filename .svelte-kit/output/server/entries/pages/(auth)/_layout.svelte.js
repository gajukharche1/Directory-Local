import { D as FILENAME, g as push_element, h as pop_element } from "../../../chunks/server.js";
import { t as Shield_check } from "../../../chunks/shield-check.js";
import { t as Arrow_left } from "../../../chunks/arrow-left.js";
// src/routes/(auth)/+layout.svelte
_layout[FILENAME] = "src/routes/(auth)/+layout.svelte";
function _layout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { children } = $$props;
		$$renderer.push(`<div class="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-muted/20">`);
		push_element($$renderer, "div", 8, 0);
		$$renderer.push(`<div class="sm:mx-auto sm:w-full sm:max-w-md px-4">`);
		push_element($$renderer, "div", 9, 2);
		$$renderer.push(`<a href="/" class="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-6 transition-colors">`);
		push_element($$renderer, "a", 10, 4);
		Arrow_left($$renderer, { class: "h-3.5 w-3.5" });
		$$renderer.push(`<!----> <span>`);
		push_element($$renderer, "span", 15, 6);
		$$renderer.push(`Back to Pimple Saudagar Directory</span>`);
		pop_element();
		$$renderer.push(`</a>`);
		pop_element();
		$$renderer.push(` <div class="flex items-center gap-2 mb-2">`);
		push_element($$renderer, "div", 18, 4);
		$$renderer.push(`<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-base shadow-sm">`);
		push_element($$renderer, "div", 19, 6);
		$$renderer.push(`PS</div>`);
		pop_element();
		$$renderer.push(` <div>`);
		push_element($$renderer, "div", 22, 6);
		$$renderer.push(`<span class="font-bold tracking-tight text-lg text-foreground block leading-none">`);
		push_element($$renderer, "span", 23, 8);
		$$renderer.push(`Pimple Saudagar</span>`);
		pop_element();
		$$renderer.push(` <span class="text-[10px] tracking-wider text-muted-foreground uppercase font-semibold">`);
		push_element($$renderer, "span", 26, 8);
		$$renderer.push(`Hyperlocal Business Directory</span>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <div class="mt-4 sm:mx-auto sm:w-full sm:max-w-md px-4">`);
		push_element($$renderer, "div", 33, 2);
		$$renderer.push(`<div class="bg-card py-8 px-6 shadow-card rounded-xl border border-border sm:px-10">`);
		push_element($$renderer, "div", 34, 4);
		children($$renderer);
		$$renderer.push(`<!----></div>`);
		pop_element();
		$$renderer.push(` <div class="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">`);
		push_element($$renderer, "div", 38, 4);
		Shield_check($$renderer, { class: "h-4 w-4 text-emerald-600" });
		$$renderer.push(`<!----> <span>`);
		push_element($$renderer, "span", 40, 6);
		$$renderer.push(`End-to-End Secure Auth &amp; Argon2id Password Encryption</span>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(`</div>`);
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