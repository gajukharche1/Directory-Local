import { D as FILENAME, c as head, g as push_element, h as pop_element } from "../../../../chunks/server.js";
import { t as Mail } from "../../../../chunks/mail.js";
import { t as Arrow_left } from "../../../../chunks/arrow-left.js";
// src/routes/(auth)/forgot-password/+page.svelte
_page[FILENAME] = "src/routes/(auth)/forgot-password/+page.svelte";
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		head("1xufxwe", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Reset Password | Pimple Saudagar Directory</title>`);
			});
		});
		$$renderer.push(`<div>`);
		push_element($$renderer, "div", 15, 0);
		$$renderer.push(`<div class="mb-6">`);
		push_element($$renderer, "div", 16, 2);
		$$renderer.push(`<h2 class="text-xl font-bold tracking-tight text-foreground">`);
		push_element($$renderer, "h2", 17, 4);
		$$renderer.push(`Reset your password</h2>`);
		pop_element();
		$$renderer.push(` <p class="text-xs text-muted-foreground mt-1">`);
		push_element($$renderer, "p", 18, 4);
		$$renderer.push(`Enter your registered email address to receive a secure password reset link</p>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` `);
		$$renderer.push(`<!--[-1--><form class="space-y-4">`);
		push_element($$renderer, "form", 28, 4);
		$$renderer.push(`<div>`);
		push_element($$renderer, "div", 29, 6);
		$$renderer.push(`<label for="reset-email" class="block text-xs font-semibold text-foreground mb-1">`);
		push_element($$renderer, "label", 30, 8);
		$$renderer.push(`Email address</label>`);
		pop_element();
		$$renderer.push(` <div class="relative">`);
		push_element($$renderer, "div", 31, 8);
		Mail($$renderer, { class: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" });
		$$renderer.push(`<!----> <input id="reset-email" type="email" name="email" required="" placeholder="name@example.com" class="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary"/>`);
		push_element($$renderer, "input", 33, 10);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <button type="submit" class="w-full inline-flex items-center justify-center rounded-lg bg-primary py-2.5 px-4 text-sm font-semibold text-primary-foreground shadow transition hover:bg-primary-600">`);
		push_element($$renderer, "button", 44, 6);
		$$renderer.push(`Send Reset Link</button>`);
		pop_element();
		$$renderer.push(`</form>`);
		pop_element();
		$$renderer.push(`<!--]--> <div class="mt-6 pt-4 border-t text-center text-xs text-muted-foreground">`);
		push_element($$renderer, "div", 53, 2);
		$$renderer.push(`<a href="/login" class="inline-flex items-center gap-1 font-semibold text-primary hover:underline">`);
		push_element($$renderer, "a", 54, 4);
		Arrow_left($$renderer, { class: "h-3 w-3" });
		$$renderer.push(`<!----> <span>`);
		push_element($$renderer, "span", 59, 6);
		$$renderer.push(`Back to Sign In</span>`);
		pop_element();
		$$renderer.push(`</a>`);
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