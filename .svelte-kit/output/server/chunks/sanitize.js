import sanitizeHtml from "sanitize-html";
// src/lib/security/sanitize.ts
var SANITIZE_OPTIONS = {
	allowedTags: [
		"p",
		"br",
		"strong",
		"em",
		"u",
		"h2",
		"h3",
		"h4",
		"ul",
		"ol",
		"li",
		"blockquote",
		"a"
	],
	allowedAttributes: { a: [
		"href",
		"title",
		"target",
		"rel"
	] },
	transformTags: { a: (tagName, attribs) => {
		const href = attribs.href || "";
		const cleanHref = href.startsWith("https://") || href.startsWith("mailto:") || href.startsWith("tel:") ? href : "#";
		return {
			tagName,
			attribs: {
				...attribs,
				href: cleanHref,
				target: "_blank",
				rel: "nofollow noopener noreferrer"
			}
		};
	} },
	disallowedTagsMode: "discard"
};
/**
* Sanitizes rich-text user input against XSS vectors before database writes.
*/
function sanitizeRichText(dirty) {
	if (!dirty) return "";
	return sanitizeHtml(dirty, SANITIZE_OPTIONS).trim();
}
/**
* Strips all HTML tags entirely for plain-text fields (e.g. titles, reviews, comments).
*/
function stripHtml(dirty) {
	if (!dirty) return "";
	const spaced = dirty.replace(/>\s*</g, "> <");
	return sanitizeHtml(spaced, {
		allowedTags: [],
		allowedAttributes: {}
	}).replace(/\s+/g, " ").trim();
}
export { stripHtml as n, sanitizeRichText as t };

//# sourceMappingURL=sanitize.js.map