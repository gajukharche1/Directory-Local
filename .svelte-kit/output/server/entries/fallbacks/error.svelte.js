import { D as FILENAME, E as escape_html, g as push_element, h as pop_element } from "../../chunks/server.js";
import { t as page } from "../../chunks/state.js";
// node_modules/@sveltejs/kit/src/runtime/components/error.svelte
Error[FILENAME] = "node_modules/@sveltejs/kit/src/runtime/components/error.svelte";
function Error($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<h1>`);
		push_element($$renderer, "h1", 7, 0);
		$$renderer.push(`${escape_html(page.status)}</h1>`);
		pop_element();
		$$renderer.push(` <p>`);
		push_element($$renderer, "p", 8, 0);
		$$renderer.push(`${escape_html(page.error?.message)}</p>`);
		pop_element();
	}, Error);
}
Error.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export { Error as default };

//# sourceMappingURL=error.svelte.js.map