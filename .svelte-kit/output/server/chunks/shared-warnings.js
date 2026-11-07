// node_modules/@sveltejs/kit/src/runtime/app/env/server.js
var building = false;
var prerendering = false;
function set_building() {
	building = true;
}
function set_prerendering() {
	prerendering = true;
}
// node_modules/@sveltejs/kit/src/messages/internal/shared.js
/**
* Whether shared errors include their full text on the server even though `DEV` is false. This is
* enabled while the app is being built (analysed or prerendered)
*/
var verbose = false;
function enable_verbose_errors() {
	verbose = true;
}
/**
* @typedef {{ element?: Element }} ClientWarningOptions
* - `element`: logged after the warning, so that it can be inspected in the browser's devtools
*/
/** `console.warn` styles for the code and text of shared runtime warnings, as in Svelte */
var bold = "font-weight: bold";
var normal = "font-weight: normal";
/**
* Throws the full diagnostic. Generated helpers throw their URL-only production error inline, so
* bundlers can remove both this call and the message text from production browser builds
* @param {string} code
* @param {string} message
* @param {Function} caller The generated helper, which is omitted from the stack along with this function
* @returns {never}
*/
function throw_error(code, message, caller) {
	const error = /* @__PURE__ */ new Error(`${code}\n${message}\nhttps://svelte.dev/e/kit/${code}`);
	error.name = "SvelteKit error";
	Error.captureStackTrace?.(error, caller);
	throw error;
}
// node_modules/@sveltejs/kit/src/messages/shared-warnings.js
/**
* `$app/environment` is deprecated, use `$app/env` instead
* @param {void} _values
*/
function app_environment_deprecated(_values) {
	console.warn(`%c[sveltekit] app_environment_deprecated\n%c\`\$app/environment\` is deprecated, use \`\$app/env\` instead\nhttps://svelte.dev/e/kit/app_environment_deprecated`, bold, normal);
}
/**
* `%route%`: Calling `depends('%dependency%')` will throw an error in Firefox because `%scheme%` is a special URI scheme
* @param {{ "route": string; "dependency": string; "scheme": string }} _values
*/
function depends_special_scheme(_values) {
	console.warn(`%c[sveltekit] depends_special_scheme\n%c${`\`${_values.route}\`: Calling \`depends('${_values.dependency}')\` will throw an error in Firefox because \`${_values.scheme}\` is a special URI scheme`}\nhttps://svelte.dev/e/kit/depends_special_scheme`, bold, normal);
}
/**
* The properties of `form.fields` are virtual, so operators like `in` and `Object.keys` are meaningless. If you need the current value of a form field, use `form.fields.x.value()`
* @param {void} _values
*/
function form_fields_enumerated(_values) {
	console.warn(`%c[sveltekit] form_fields_enumerated\n%cThe properties of \`form.fields\` are virtual, so operators like \`in\` and \`Object.keys\` are meaningless. If you need the current value of a form field, use \`form.fields.x.value()\`\nhttps://svelte.dev/e/kit/form_fields_enumerated`, bold, normal);
}
export { enable_verbose_errors as a, verbose as c, set_building as d, set_prerendering as f, bold as i, building as l, depends_special_scheme as n, normal as o, form_fields_enumerated as r, throw_error as s, app_environment_deprecated as t, prerendering as u };

//# sourceMappingURL=shared-warnings.js.map