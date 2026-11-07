import { D as FILENAME, E as escape_html, S as attr, c as head, g as push_element, h as pop_element, m as stringify, s as ensure_array_like, t as attr_class } from "../../../../../chunks/server.js";
import "../../../../../chunks/forms.js";
import { t as Search } from "../../../../../chunks/search.js";
import { t as External_link } from "../../../../../chunks/external-link.js";
import { t as Star } from "../../../../../chunks/star.js";
// src/routes/(admin)/admin/listings/+page.svelte
_page[FILENAME] = "src/routes/(admin)/admin/listings/+page.svelte";
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		const statusTabs = [
			{
				label: "All",
				value: ""
			},
			{
				label: "Published",
				value: "published"
			},
			{
				label: "Pending Review",
				value: "pending_review"
			},
			{
				label: "Draft",
				value: "draft"
			},
			{
				label: "Rejected",
				value: "rejected"
			},
			{
				label: "Archived",
				value: "archived"
			}
		];
		head("1lb89rv", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Directory Listings | Admin Console</title>`);
			});
		});
		$$renderer.push(`<div class="space-y-6">`);
		push_element($$renderer, "div", 22, 0);
		$$renderer.push(`<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">`);
		push_element($$renderer, "div", 24, 2);
		$$renderer.push(`<div>`);
		push_element($$renderer, "div", 25, 4);
		$$renderer.push(`<h1 class="text-2xl font-bold tracking-tight text-foreground">`);
		push_element($$renderer, "h1", 26, 6);
		$$renderer.push(`Directory Listings</h1>`);
		pop_element();
		$$renderer.push(` <p class="text-xs text-muted-foreground mt-0.5">`);
		push_element($$renderer, "p", 27, 6);
		$$renderer.push(`Manage and moderate all ${escape_html(data.totalCount)} businesses registered in Pimple Saudagar</p>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <form method="GET" class="relative w-full sm:w-72">`);
		push_element($$renderer, "form", 33, 4);
		Search($$renderer, { class: "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" });
		$$renderer.push(`<!----> <input type="text" name="q"${attr("value", data.query)} placeholder="Filter by title or address..." class="w-full rounded-lg border bg-background py-1.5 pl-8 pr-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"/>`);
		push_element($$renderer, "input", 35, 6);
		pop_element();
		$$renderer.push(` `);
		if (data.statusFilter) {
			$$renderer.push(`<!--[0--><input type="hidden" name="status"${attr("value", data.statusFilter)}/>`);
			push_element($$renderer, "input", 43, 8);
			pop_element();
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></form>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <div class="flex items-center gap-1 overflow-x-auto pb-1 border-b text-xs">`);
		push_element($$renderer, "div", 49, 2);
		$$renderer.push(`<!--[-->`);
		const each_array = ensure_array_like(statusTabs);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let tab = each_array[$$index];
			$$renderer.push(`<a${attr("href", `/admin/listings?status=${stringify(tab.value)}${data.query ? `&q=${encodeURIComponent(data.query)}` : ""}`)}${attr_class(`px-3 py-1.5 font-semibold rounded-lg transition whitespace-nowrap ${data.statusFilter === tab.value ? "bg-red-600 text-white shadow-xs" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`)}>`);
			push_element($$renderer, "a", 51, 6);
			$$renderer.push(`${escape_html(tab.label)}</a>`);
			pop_element();
		}
		$$renderer.push(`<!--]--></div>`);
		pop_element();
		$$renderer.push(` `);
		if (data.listings.length === 0) {
			$$renderer.push(`<!--[0--><div class="rounded-xl border border-dashed bg-card p-12 text-center shadow-card">`);
			push_element($$renderer, "div", 64, 4);
			$$renderer.push(`<p class="text-xs text-muted-foreground">`);
			push_element($$renderer, "p", 65, 6);
			$$renderer.push(`No listings match the selected filters.</p>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
		} else {
			$$renderer.push(`<!--[-1--><div class="rounded-xl border bg-card shadow-card overflow-hidden">`);
			push_element($$renderer, "div", 68, 4);
			$$renderer.push(`<div class="overflow-x-auto">`);
			push_element($$renderer, "div", 69, 6);
			$$renderer.push(`<table class="w-full text-left text-xs">`);
			push_element($$renderer, "table", 70, 8);
			$$renderer.push(`<thead class="border-b bg-muted/40 font-semibold text-muted-foreground">`);
			push_element($$renderer, "thead", 71, 10);
			$$renderer.push(`<tr>`);
			push_element($$renderer, "tr", 72, 12);
			$$renderer.push(`<th class="p-3.5">`);
			push_element($$renderer, "th", 73, 14);
			$$renderer.push(`Business Name</th>`);
			pop_element();
			$$renderer.push(`<th class="p-3.5">`);
			push_element($$renderer, "th", 74, 14);
			$$renderer.push(`Category</th>`);
			pop_element();
			$$renderer.push(`<th class="p-3.5">`);
			push_element($$renderer, "th", 75, 14);
			$$renderer.push(`Locality</th>`);
			pop_element();
			$$renderer.push(`<th class="p-3.5">`);
			push_element($$renderer, "th", 76, 14);
			$$renderer.push(`Rating</th>`);
			pop_element();
			$$renderer.push(`<th class="p-3.5">`);
			push_element($$renderer, "th", 77, 14);
			$$renderer.push(`Moderation Status</th>`);
			pop_element();
			$$renderer.push(`<th class="p-3.5 text-right">`);
			push_element($$renderer, "th", 78, 14);
			$$renderer.push(`Actions</th>`);
			pop_element();
			$$renderer.push(`</tr>`);
			pop_element();
			$$renderer.push(`</thead>`);
			pop_element();
			$$renderer.push(`<tbody class="divide-y divide-border">`);
			push_element($$renderer, "tbody", 81, 10);
			$$renderer.push(`<!--[-->`);
			const each_array_1 = ensure_array_like(data.listings);
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let listing = each_array_1[$$index_1];
				$$renderer.push(`<tr class="hover:bg-muted/30 transition">`);
				push_element($$renderer, "tr", 83, 14);
				$$renderer.push(`<td class="p-3.5 font-bold text-foreground max-w-xs truncate">`);
				push_element($$renderer, "td", 84, 16);
				$$renderer.push(`${escape_html(listing.title)}</td>`);
				pop_element();
				$$renderer.push(`<td class="p-3.5 text-muted-foreground">`);
				push_element($$renderer, "td", 87, 16);
				if (listing.categories.length > 0) {
					$$renderer.push(`<!--[0--><span class="bg-muted px-2 py-0.5 rounded text-[11px] font-medium text-foreground">`);
					push_element($$renderer, "span", 89, 20);
					$$renderer.push(`${escape_html(listing.categories[0].category.name)}</span>`);
					pop_element();
				} else {
					$$renderer.push(`<!--[-1--><span class="text-muted-foreground text-[11px]">`);
					push_element($$renderer, "span", 93, 20);
					$$renderer.push(`—</span>`);
					pop_element();
				}
				$$renderer.push(`<!--]--></td>`);
				pop_element();
				$$renderer.push(`<td class="p-3.5 text-muted-foreground">`);
				push_element($$renderer, "td", 96, 16);
				$$renderer.push(`${escape_html(listing.locality)}</td>`);
				pop_element();
				$$renderer.push(`<td class="p-3.5">`);
				push_element($$renderer, "td", 97, 16);
				$$renderer.push(`<div class="flex items-center gap-1 font-semibold text-foreground">`);
				push_element($$renderer, "div", 98, 18);
				Star($$renderer, { class: "h-3 w-3 fill-amber-400 text-amber-400" });
				$$renderer.push(`<!----> <span>`);
				push_element($$renderer, "span", 100, 20);
				$$renderer.push(`${escape_html(listing.averageRating.toFixed(1))}</span>`);
				pop_element();
				$$renderer.push(` <span class="text-muted-foreground text-[10px]">`);
				push_element($$renderer, "span", 101, 20);
				$$renderer.push(`(${escape_html(listing.reviewCount)})</span>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(`</td>`);
				pop_element();
				$$renderer.push(`<td class="p-3.5">`);
				push_element($$renderer, "td", 104, 16);
				$$renderer.push(`<form method="POST" action="?/updateStatus" class="inline-block">`);
				push_element($$renderer, "form", 105, 18);
				$$renderer.push(`<input type="hidden" name="listingId"${attr("value", listing.id)}/>`);
				push_element($$renderer, "input", 106, 20);
				pop_element();
				$$renderer.push(` `);
				$$renderer.select({
					name: "status",
					value: listing.status,
					onchange: (e) => e.currentTarget.form?.requestSubmit(),
					class: `text-[11px] font-bold uppercase rounded-md border bg-background py-1 px-2 outline-none focus:border-primary ${listing.status === "published" ? "text-emerald-700 dark:text-emerald-400 border-emerald-300" : listing.status === "pending_review" ? "text-amber-700 dark:text-amber-400 border-amber-300" : "text-muted-foreground border-border"}`
				}, ($$renderer) => {
					$$renderer.option({ value: "published" }, ($$renderer) => {
						push_element($$renderer, "option", 117, 22);
						$$renderer.push(`Published`);
						pop_element();
					});
					$$renderer.option({ value: "pending_review" }, ($$renderer) => {
						push_element($$renderer, "option", 118, 22);
						$$renderer.push(`Pending Review`);
						pop_element();
					});
					$$renderer.option({ value: "draft" }, ($$renderer) => {
						push_element($$renderer, "option", 119, 22);
						$$renderer.push(`Draft`);
						pop_element();
					});
					$$renderer.option({ value: "rejected" }, ($$renderer) => {
						push_element($$renderer, "option", 120, 22);
						$$renderer.push(`Rejected`);
						pop_element();
					});
					$$renderer.option({ value: "archived" }, ($$renderer) => {
						push_element($$renderer, "option", 121, 22);
						$$renderer.push(`Archived`);
						pop_element();
					});
				});
				$$renderer.push(`</form>`);
				pop_element();
				$$renderer.push(`</td>`);
				pop_element();
				$$renderer.push(`<td class="p-3.5 text-right">`);
				push_element($$renderer, "td", 125, 16);
				$$renderer.push(`<a${attr("href", `/listing/${stringify(listing.slug)}`)} target="_blank" class="inline-flex items-center gap-1 font-semibold text-primary hover:underline">`);
				push_element($$renderer, "a", 126, 18);
				$$renderer.push(`<span>`);
				push_element($$renderer, "span", 131, 20);
				$$renderer.push(`View</span>`);
				pop_element();
				$$renderer.push(` `);
				External_link($$renderer, { class: "h-3 w-3" });
				$$renderer.push(`<!----></a>`);
				pop_element();
				$$renderer.push(`</td>`);
				pop_element();
				$$renderer.push(`</tr>`);
				pop_element();
			}
			$$renderer.push(`<!--]--></tbody>`);
			pop_element();
			$$renderer.push(`</table>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
			$$renderer.push(`</div>`);
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