import { D as FILENAME, E as escape_html, S as attr, a as derived, c as head, g as push_element, h as pop_element, m as stringify, s as ensure_array_like } from "../../../../../chunks/server.js";
import { t as ListingCard } from "../../../../../chunks/ListingCard.js";
import { t as Chevron_right } from "../../../../../chunks/chevron-right.js";
import { t as Folder } from "../../../../../chunks/folder.js";
// src/routes/(public)/category/[...slug]/+page.svelte
_page[FILENAME] = "src/routes/(public)/category/[...slug]/+page.svelte";
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let category = derived(() => data.category);
		let listings = derived(() => data.listings);
		head("bc5hgw", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>${escape_html(category().name)} in Pimple Saudagar | Top Rated Services &amp; Businesses</title>`);
			});
			$$renderer.push(`<meta name="description"${attr("content", category().description || `Find the best ${category().name.toLowerCase()} in Pimple Saudagar with ratings, contact info, and directions.`)}/>`);
			push_element($$renderer, "meta", 14, 2);
			pop_element();
			$$renderer.push(` <link rel="canonical"${attr("href", `/category/${data.slugPath}`)}/>`);
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
		$$renderer.push(`Categories</a>`);
		pop_element();
		$$renderer.push(` `);
		if (category().parent) {
			$$renderer.push("<!--[0-->");
			Chevron_right($$renderer, { class: "h-3 w-3" });
			$$renderer.push(`<!----> <a${attr("href", `/category/${stringify(category().parent.slug)}`)} class="hover:text-foreground transition-colors">`);
			push_element($$renderer, "a", 31, 8);
			$$renderer.push(`${escape_html(category().parent.name)}</a>`);
			pop_element();
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		Chevron_right($$renderer, { class: "h-3 w-3" });
		$$renderer.push(`<!----> <span class="text-foreground font-medium">`);
		push_element($$renderer, "span", 36, 6);
		$$renderer.push(`${escape_html(category().name)}</span>`);
		pop_element();
		$$renderer.push(`</nav>`);
		pop_element();
		$$renderer.push(` <div class="mb-8 border-b pb-6">`);
		push_element($$renderer, "div", 40, 4);
		$$renderer.push(`<h1 class="text-3xl font-extrabold tracking-tight text-foreground">`);
		push_element($$renderer, "h1", 41, 6);
		$$renderer.push(`${escape_html(category().name)} in Pimple Saudagar</h1>`);
		pop_element();
		$$renderer.push(` `);
		if (category().description) {
			$$renderer.push(`<!--[0--><p class="text-sm text-muted-foreground mt-2 max-w-2xl">`);
			push_element($$renderer, "p", 45, 8);
			$$renderer.push(`${escape_html(category().description)}</p>`);
			pop_element();
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (category().children && category().children.length > 0) {
			$$renderer.push(`<!--[0--><div class="mt-5 flex flex-wrap gap-2 items-center">`);
			push_element($$renderer, "div", 52, 8);
			$$renderer.push(`<span class="text-xs font-semibold text-muted-foreground">`);
			push_element($$renderer, "span", 53, 10);
			$$renderer.push(`Subcategories:</span>`);
			pop_element();
			$$renderer.push(` <!--[-->`);
			const each_array = ensure_array_like(category().children);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let child = each_array[$$index];
				$$renderer.push(`<a${attr("href", `/category/${stringify(category().slug)}/${stringify(child.slug)}`)} class="rounded-lg border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary hover:text-primary transition shadow-xs">`);
				push_element($$renderer, "a", 55, 12);
				$$renderer.push(`${escape_html(child.name)}</a>`);
				pop_element();
			}
			$$renderer.push(`<!--]--></div>`);
			pop_element();
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
		pop_element();
		$$renderer.push(` <div>`);
		push_element($$renderer, "div", 67, 4);
		$$renderer.push(`<div class="flex items-center justify-between mb-4">`);
		push_element($$renderer, "div", 68, 6);
		$$renderer.push(`<h2 class="text-base font-bold text-foreground">`);
		push_element($$renderer, "h2", 69, 8);
		$$renderer.push(`Available Businesses (${escape_html(listings().length)})</h2>`);
		pop_element();
		$$renderer.push(` <span class="text-xs text-muted-foreground">`);
		push_element($$renderer, "span", 72, 8);
		$$renderer.push(`Sorted by Verified &amp; Plan Priority</span>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` `);
		if (listings().length === 0) {
			$$renderer.push(`<!--[0--><div class="rounded-xl border border-dashed p-12 text-center bg-card">`);
			push_element($$renderer, "div", 76, 8);
			Folder($$renderer, { class: "h-10 w-10 text-muted-foreground/60 mx-auto mb-2" });
			$$renderer.push(`<!----> <h3 class="font-bold text-sm text-foreground">`);
			push_element($$renderer, "h3", 78, 10);
			$$renderer.push(`No listings found yet</h3>`);
			pop_element();
			$$renderer.push(` <p class="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">`);
			push_element($$renderer, "p", 79, 10);
			$$renderer.push(`Are you a local business owner providing ${escape_html(category().name.toLowerCase())} in Pimple Saudagar?</p>`);
			pop_element();
			$$renderer.push(` <a href="/submit" class="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-600 transition">`);
			push_element($$renderer, "a", 82, 10);
			$$renderer.push(`Add Your Business Listing</a>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
		} else {
			$$renderer.push(`<!--[-1--><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">`);
			push_element($$renderer, "div", 90, 8);
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