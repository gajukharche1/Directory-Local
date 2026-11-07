import { D as FILENAME, E as escape_html, S as attr, c as head, g as push_element, h as pop_element, s as ensure_array_like } from "../../../../../chunks/server.js";
import "../../../../../chunks/forms.js";
import { t as Cloud_upload } from "../../../../../chunks/cloud-upload.js";
import { t as Circle_check } from "../../../../../chunks/circle-check.js";
import { t as Circle_alert } from "../../../../../chunks/circle-alert.js";
import { t as File_text } from "../../../../../chunks/file-text.js";
// src/routes/(admin)/admin/imports/+page.svelte
_page[FILENAME] = "src/routes/(admin)/admin/imports/+page.svelte";
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { form } = $$props;
		let csvContent = "";
		head("16dc03g", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Bulk CSV Import | Admin Console</title>`);
			});
		});
		$$renderer.push(`<div class="space-y-6">`);
		push_element($$renderer, "div", 24, 0);
		$$renderer.push(`<div>`);
		push_element($$renderer, "div", 25, 2);
		$$renderer.push(`<h1 class="text-2xl font-bold tracking-tight text-foreground">`);
		push_element($$renderer, "h1", 26, 4);
		$$renderer.push(`Bulk Business Import</h1>`);
		pop_element();
		$$renderer.push(` <p class="text-xs text-muted-foreground mt-0.5">`);
		push_element($$renderer, "p", 27, 4);
		$$renderer.push(`Upload or paste CSV data to quickly seed or migrate hundreds of local businesses into Pimple Saudagar.</p>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` `);
		if (form?.success) {
			$$renderer.push(`<!--[0--><div class="rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 p-6 space-y-2">`);
			push_element($$renderer, "div", 33, 4);
			$$renderer.push(`<div class="flex items-center gap-2">`);
			push_element($$renderer, "div", 34, 6);
			Circle_check($$renderer, { class: "h-5 w-5 text-emerald-600 dark:text-emerald-400" });
			$$renderer.push(`<!----> <h3 class="font-bold text-sm text-foreground">`);
			push_element($$renderer, "h3", 36, 8);
			$$renderer.push(`Batch Import Completed Successfully!</h3>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
			$$renderer.push(` <p class="text-xs text-muted-foreground">`);
			push_element($$renderer, "p", 38, 6);
			$$renderer.push(`Imported <strong>`);
			push_element($$renderer, "strong", 39, 17);
			$$renderer.push(`${escape_html(form.importedCount)}</strong>`);
			pop_element();
			$$renderer.push(` new local businesses. `);
			if (form.failedCount && form.failedCount > 0) {
				$$renderer.push(`<!--[0--><span class="text-destructive font-semibold">`);
				push_element($$renderer, "span", 41, 10);
				$$renderer.push(`(${escape_html(form.failedCount)} rows had errors)</span>`);
				pop_element();
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></p>`);
			pop_element();
			$$renderer.push(` `);
			if (form.errors && form.errors.length > 0) {
				$$renderer.push(`<!--[0--><ul class="text-xs text-destructive list-disc list-inside mt-2 space-y-1">`);
				push_element($$renderer, "ul", 45, 8);
				$$renderer.push(`<!--[-->`);
				const each_array = ensure_array_like(form.errors);
				for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
					let err = each_array[$$index];
					$$renderer.push(`<li>`);
					push_element($$renderer, "li", 47, 12);
					$$renderer.push(`${escape_html(err)}</li>`);
					pop_element();
				}
				$$renderer.push(`<!--]--></ul>`);
				pop_element();
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
			pop_element();
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (form?.error) {
			$$renderer.push(`<!--[0--><div class="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-xs text-destructive flex items-start gap-2">`);
			push_element($$renderer, "div", 55, 4);
			Circle_alert($$renderer, { class: "h-4 w-4 shrink-0 mt-0.5" });
			$$renderer.push(`<!----> <span>`);
			push_element($$renderer, "span", 57, 6);
			$$renderer.push(`${escape_html(form.error)}</span>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="rounded-xl border bg-card p-6 shadow-card space-y-4">`);
		push_element($$renderer, "div", 61, 2);
		$$renderer.push(`<div class="flex items-center justify-between">`);
		push_element($$renderer, "div", 62, 4);
		$$renderer.push(`<div class="flex items-center gap-2">`);
		push_element($$renderer, "div", 63, 6);
		File_text($$renderer, { class: "h-4 w-4 text-primary" });
		$$renderer.push(`<!----> <h3 class="font-bold text-sm text-foreground">`);
		push_element($$renderer, "h3", 65, 8);
		$$renderer.push(`Paste CSV Records</h3>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <button type="button" class="text-xs font-semibold text-primary hover:underline">`);
		push_element($$renderer, "button", 68, 6);
		$$renderer.push(`Load Sample Template</button>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <form method="POST" action="?/batchImport" class="space-y-4">`);
		push_element($$renderer, "form", 77, 4);
		$$renderer.push(`<textarea name="csvData" rows="10" placeholder="Paste CSV with headers: title,address,locality,phone,whatsapp,email,website,category,location..." class="w-full font-mono rounded-lg border bg-background p-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary">`);
		push_element($$renderer, "textarea", 89, 6);
		const $$body = escape_html(csvContent);
		if ($$body) $$renderer.push(`${$$body}`);
		$$renderer.push(`</textarea>`);
		pop_element();
		$$renderer.push(` <button type="submit"${attr("disabled", !csvContent.trim(), true)} class="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-xs font-semibold text-white shadow hover:bg-red-700 transition disabled:opacity-50">`);
		push_element($$renderer, "button", 97, 6);
		$$renderer.push("<!--[-1-->");
		Cloud_upload($$renderer, { class: "h-3.5 w-3.5" });
		$$renderer.push(`<!----> <span>`);
		push_element($$renderer, "span", 107, 10);
		$$renderer.push(`Execute CSV Import</span>`);
		pop_element();
		$$renderer.push(`<!--]--></button>`);
		pop_element();
		$$renderer.push(`</form>`);
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