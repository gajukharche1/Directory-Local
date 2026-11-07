import { D as FILENAME, c as head, g as push_element, h as pop_element } from "../../chunks/server.js";
// src/lib/components/ui/SkipLink.svelte
SkipLink[FILENAME] = "src/lib/components/ui/SkipLink.svelte";
function SkipLink($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<a href="#main-content" class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-indigo-600 focus:px-4 focus:py-2.5 focus:text-sm focus:font-bold focus:text-white focus:shadow-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none">`);
		push_element($$renderer, "a", 1, 0);
		$$renderer.push(`Skip to main content</a>`);
		pop_element();
	}, SkipLink);
}
SkipLink.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
// src/routes/+layout.svelte
_layout[FILENAME] = "src/routes/+layout.svelte";
function _layout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { children } = $$props;
		head("12qhfyh", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Pimple Saudagar Local Business Directory | Find Top Services Nearby</title>`);
			});
			$$renderer.push(`<meta name="description" content="Discover verified local businesses, restaurants, healthcare, clinics, and professional services across Pimple Saudagar, PCMC, Pune."/>`);
			push_element($$renderer, "meta", 11, 2);
			pop_element();
		});
		$$renderer.push(`<div class="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-indigo-500/20">`);
		push_element($$renderer, "div", 17, 0);
		SkipLink($$renderer, {});
		$$renderer.push(`<!----> <div id="main-content" tabindex="-1" class="focus:outline-none">`);
		push_element($$renderer, "div", 19, 2);
		children($$renderer);
		$$renderer.push(`<!----></div>`);
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