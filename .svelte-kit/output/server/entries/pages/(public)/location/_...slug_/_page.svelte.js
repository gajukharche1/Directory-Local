import { D as FILENAME, E as escape_html, S as attr, a as derived, c as head, g as push_element, h as pop_element, m as stringify, s as ensure_array_like } from "../../../../../chunks/server.js";
import { t as ListingCard } from "../../../../../chunks/ListingCard.js";
import { t as Chevron_right } from "../../../../../chunks/chevron-right.js";
import { r as Map_pin } from "../../../../../chunks/opening-hours.js";
// src/routes/(public)/location/[...slug]/+page.svelte
_page[FILENAME] = "src/routes/(public)/location/[...slug]/+page.svelte";
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let location = derived(() => data.location);
		let listings = derived(() => data.listings);
		head("10x6bgn", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Businesses &amp; Services in ${escape_html(location().name)}, Pimple Saudagar | Directory</title>`);
			});
			$$renderer.push(`<meta name="description"${attr("content", location().description || `Explore top verified shops, doctors, dining, and professional services located at ${location().name}, Pimple Saudagar.`)}/>`);
			push_element($$renderer, "meta", 14, 2);
			pop_element();
			$$renderer.push(` <link rel="canonical"${attr("href", `/location/${data.slugPath}`)}/>`);
			push_element($$renderer, "link", 19, 2);
			pop_element();
		});
		$$renderer.push(`<div class="min-h-screen flex flex-col bg-background">`);
		push_element($$renderer, "div", 22, 0);
		$$renderer.push(`<main class="container mx-auto px-4 py-8 max-w-6xl flex-1">`);
		push_element($$renderer, "main", 23, 2);
		$$renderer.push(`<nav class="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">`);
		push_element($$renderer, "nav", 25, 4);
		$$renderer.push(`<a href="/" class="hover:text-foreground transition-colors">`);
		push_element($$renderer, "a", 26, 6);
		$$renderer.push(`Home</a>`);
		pop_element();
		$$renderer.push(` `);
		Chevron_right($$renderer, { class: "h-3 w-3" });
		$$renderer.push(`<!----> <a href="/search" class="hover:text-foreground transition-colors">`);
		push_element($$renderer, "a", 28, 6);
		$$renderer.push(`Locations</a>`);
		pop_element();
		$$renderer.push(` `);
		if (location().parent) {
			$$renderer.push("<!--[0-->");
			Chevron_right($$renderer, { class: "h-3 w-3" });
			$$renderer.push(`<!----> <a${attr("href", `/location/${stringify(location().parent.slug)}`)} class="hover:text-foreground transition-colors">`);
			push_element($$renderer, "a", 31, 8);
			$$renderer.push(`${escape_html(location().parent.name)}</a>`);
			pop_element();
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		Chevron_right($$renderer, { class: "h-3 w-3" });
		$$renderer.push(`<!----> <span class="text-foreground font-medium">`);
		push_element($$renderer, "span", 36, 6);
		$$renderer.push(`${escape_html(location().name)}</span>`);
		pop_element();
		$$renderer.push(`</nav>`);
		pop_element();
		$$renderer.push(` <div class="mb-8 border-b pb-6">`);
		push_element($$renderer, "div", 40, 4);
		$$renderer.push(`<div class="inline-flex items-center gap-1.5 text-xs font-medium text-primary mb-2">`);
		push_element($$renderer, "div", 41, 6);
		Map_pin($$renderer, { class: "h-3.5 w-3.5" });
		$$renderer.push(`<!----> <span>`);
		push_element($$renderer, "span", 43, 8);
		$$renderer.push(`Pimple Saudagar, PCMC</span>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <h1 class="text-3xl font-extrabold tracking-tight text-foreground">`);
		push_element($$renderer, "h1", 45, 6);
		$$renderer.push(`${escape_html(location().name)} Local Businesses</h1>`);
		pop_element();
		$$renderer.push(` `);
		if (location().description) {
			$$renderer.push(`<!--[0--><p class="text-sm text-muted-foreground mt-2 max-w-2xl">`);
			push_element($$renderer, "p", 49, 8);
			$$renderer.push(`${escape_html(location().description)}</p>`);
			pop_element();
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (location().children && location().children.length > 0) {
			$$renderer.push(`<!--[0--><div class="mt-5 flex flex-wrap gap-2 items-center">`);
			push_element($$renderer, "div", 56, 8);
			$$renderer.push(`<span class="text-xs font-semibold text-muted-foreground">`);
			push_element($$renderer, "span", 57, 10);
			$$renderer.push(`Nearby Landmarks:</span>`);
			pop_element();
			$$renderer.push(` <!--[-->`);
			const each_array = ensure_array_like(location().children);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let child = each_array[$$index];
				$$renderer.push(`<a${attr("href", `/location/${stringify(location().slug)}/${stringify(child.slug)}`)} class="rounded-lg border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary hover:text-primary transition shadow-xs">`);
				push_element($$renderer, "a", 59, 12);
				$$renderer.push(`${escape_html(child.name)}</a>`);
				pop_element();
			}
			$$renderer.push(`<!--]--></div>`);
			pop_element();
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
		pop_element();
		$$renderer.push(` <div>`);
		push_element($$renderer, "div", 71, 4);
		$$renderer.push(`<div class="flex items-center justify-between mb-4">`);
		push_element($$renderer, "div", 72, 6);
		$$renderer.push(`<h2 class="text-base font-bold text-foreground">`);
		push_element($$renderer, "h2", 73, 8);
		$$renderer.push(`Businesses in ${escape_html(location().name)} (${escape_html(listings().length)})</h2>`);
		pop_element();
		$$renderer.push(` <span class="text-xs text-muted-foreground">`);
		push_element($$renderer, "span", 76, 8);
		$$renderer.push(`Sorted by Verified &amp; Plan Priority</span>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` `);
		if (listings().length === 0) {
			$$renderer.push(`<!--[0--><div class="rounded-xl border border-dashed p-12 text-center bg-card">`);
			push_element($$renderer, "div", 80, 8);
			Map_pin($$renderer, { class: "h-10 w-10 text-muted-foreground/60 mx-auto mb-2" });
			$$renderer.push(`<!----> <h3 class="font-bold text-sm text-foreground">`);
			push_element($$renderer, "h3", 82, 10);
			$$renderer.push(`No listings found in this area</h3>`);
			pop_element();
			$$renderer.push(` <p class="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">`);
			push_element($$renderer, "p", 83, 10);
			$$renderer.push(`Do you operate a business in ${escape_html(location().name)}? Add your listing to reach local customers.</p>`);
			pop_element();
			$$renderer.push(` <a href="/submit" class="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-600 transition">`);
			push_element($$renderer, "a", 86, 10);
			$$renderer.push(`List Your Business Here</a>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
		} else {
			$$renderer.push(`<!--[-1--><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">`);
			push_element($$renderer, "div", 94, 8);
			$$renderer.push(`<!--[-->`);
			const each_array_1 = ensure_array_like(listings());
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let listing = each_array_1[$$index_1];
				ListingCard($$renderer, { listing });
			}
			$$renderer.push(`<!--]--></div>`);
			pop_element();
		}
		$$renderer.push(`<!--]--></div>`);
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