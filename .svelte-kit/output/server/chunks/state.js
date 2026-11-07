import "./index-server.js";
import { y as getContext } from "./server.js";
import { J as state_read_outside_render } from "./server-errors.js";
// node_modules/@sveltejs/kit/src/runtime/app/state/server.js
function context() {
	return getContext("__request__");
}
/** @param {string} name */
function context_dev(name) {
	try {
		return context();
	} catch {
		state_read_outside_render({ name });
	}
}
var page = {
	get data() {
		return context_dev("page.data").page.data;
	},
	get error() {
		return context_dev("page.error").page.error;
	},
	get form() {
		return context_dev("page.form").page.form;
	},
	get params() {
		return context_dev("page.params").page.params;
	},
	get route() {
		return context_dev("page.route").page.route;
	},
	get shallow() {
		return context_dev("page.shallow").page.shallow;
	},
	get state() {
		return context_dev("page.state").page.state;
	},
	get status() {
		return context_dev("page.status").page.status;
	},
	get url() {
		return context_dev("page.url").page.url;
	}
};
export { page as t };

//# sourceMappingURL=state.js.map