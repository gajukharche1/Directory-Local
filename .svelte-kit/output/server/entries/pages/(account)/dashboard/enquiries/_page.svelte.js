import { D as FILENAME, E as escape_html, S as attr, c as head, g as push_element, h as pop_element, m as stringify, s as ensure_array_like, t as attr_class } from "../../../../../chunks/server.js";
import { t as Inbox } from "../../../../../chunks/inbox.js";
import { t as Phone } from "../../../../../chunks/phone.js";
import { t as Mail } from "../../../../../chunks/mail.js";
import { t as Calendar } from "../../../../../chunks/calendar.js";
import { t as Building_2 } from "../../../../../chunks/building-2.js";
// src/routes/(account)/dashboard/enquiries/+page.svelte
_page[FILENAME] = "src/routes/(account)/dashboard/enquiries/+page.svelte";
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		head("18kva8c", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Customer Leads &amp; Enquiries | Business Dashboard</title>`);
			});
		});
		$$renderer.push(`<div class="space-y-6">`);
		push_element($$renderer, "div", 12, 0);
		$$renderer.push(`<div>`);
		push_element($$renderer, "div", 13, 2);
		$$renderer.push(`<h1 class="text-2xl font-bold tracking-tight text-foreground">`);
		push_element($$renderer, "h1", 14, 4);
		$$renderer.push(`Customer Leads &amp; Inquiries</h1>`);
		pop_element();
		$$renderer.push(` <p class="text-xs text-muted-foreground mt-0.5">`);
		push_element($$renderer, "p", 15, 4);
		$$renderer.push(`Direct messages and contact requests submitted by residents in Pimple Saudagar</p>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` `);
		if (data.enquiries.length === 0) {
			$$renderer.push(`<!--[0--><div class="rounded-xl border border-dashed bg-card p-12 text-center shadow-card">`);
			push_element($$renderer, "div", 21, 4);
			Inbox($$renderer, { class: "h-10 w-10 mx-auto text-muted-foreground/60 mb-2" });
			$$renderer.push(`<!----> <h3 class="font-bold text-sm text-foreground">`);
			push_element($$renderer, "h3", 23, 6);
			$$renderer.push(`Inbox is empty</h3>`);
			pop_element();
			$$renderer.push(` <p class="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">`);
			push_element($$renderer, "p", 24, 6);
			$$renderer.push(`You have not received any customer enquiries yet. Make sure your business profile has updated phone and address details.</p>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
		} else {
			$$renderer.push(`<!--[-1--><div class="space-y-4">`);
			push_element($$renderer, "div", 29, 4);
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(data.enquiries);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let enquiry = each_array[$$index];
				$$renderer.push(`<div${attr_class(`rounded-xl border bg-card p-5 shadow-card transition-all ${!enquiry.isRead ? "border-l-4 border-l-primary" : ""}`)}>`);
				push_element($$renderer, "div", 31, 8);
				$$renderer.push(`<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b mb-3">`);
				push_element($$renderer, "div", 36, 10);
				$$renderer.push(`<div class="flex items-center gap-2">`);
				push_element($$renderer, "div", 37, 12);
				$$renderer.push(`<span class="font-bold text-sm text-foreground">`);
				push_element($$renderer, "span", 38, 14);
				$$renderer.push(`${escape_html(enquiry.name)}</span>`);
				pop_element();
				$$renderer.push(` `);
				if (!enquiry.isRead) {
					$$renderer.push(`<!--[0--><span class="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">`);
					push_element($$renderer, "span", 40, 16);
					$$renderer.push(`New Lead</span>`);
					pop_element();
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div>`);
				pop_element();
				$$renderer.push(` <div class="flex items-center gap-1.5 text-xs text-muted-foreground">`);
				push_element($$renderer, "div", 46, 12);
				Calendar($$renderer, { class: "h-3.5 w-3.5" });
				$$renderer.push(`<!----> <span>`);
				push_element($$renderer, "span", 48, 14);
				$$renderer.push(`${escape_html(new Date(enquiry.createdAt).toLocaleString())}</span>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(` <p class="text-xs text-foreground leading-relaxed whitespace-pre-wrap mb-4">`);
				push_element($$renderer, "p", 53, 10);
				$$renderer.push(`${escape_html(enquiry.message)}</p>`);
				pop_element();
				$$renderer.push(` <div class="pt-3 border-t flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">`);
				push_element($$renderer, "div", 58, 10);
				$$renderer.push(`<div class="flex flex-wrap items-center gap-4">`);
				push_element($$renderer, "div", 59, 12);
				$$renderer.push(`<a${attr("href", `mailto:${stringify(enquiry.email)}`)} class="flex items-center gap-1.5 hover:text-primary transition font-medium">`);
				push_element($$renderer, "a", 60, 14);
				Mail($$renderer, { class: "h-3.5 w-3.5" });
				$$renderer.push(`<!----> <span>`);
				push_element($$renderer, "span", 65, 16);
				$$renderer.push(`${escape_html(enquiry.email)}</span>`);
				pop_element();
				$$renderer.push(`</a>`);
				pop_element();
				$$renderer.push(` `);
				if (enquiry.phone) {
					$$renderer.push(`<!--[0--><a${attr("href", `tel:${stringify(enquiry.phone.replace(/\D/g, ""))}`)} class="flex items-center gap-1.5 hover:text-primary transition font-medium">`);
					push_element($$renderer, "a", 69, 16);
					Phone($$renderer, { class: "h-3.5 w-3.5" });
					$$renderer.push(`<!----> <span>`);
					push_element($$renderer, "span", 74, 18);
					$$renderer.push(`${escape_html(enquiry.phone)}</span>`);
					pop_element();
					$$renderer.push(`</a>`);
					pop_element();
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div>`);
				pop_element();
				$$renderer.push(` <div class="flex items-center gap-1 text-[11px] font-medium text-foreground bg-muted px-2.5 py-1 rounded-md">`);
				push_element($$renderer, "div", 79, 12);
				Building_2($$renderer, { class: "h-3 w-3 text-primary" });
				$$renderer.push(`<!----> <span>`);
				push_element($$renderer, "span", 81, 14);
				$$renderer.push(`${escape_html(enquiry.listing.title)}</span>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(`</div>`);
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