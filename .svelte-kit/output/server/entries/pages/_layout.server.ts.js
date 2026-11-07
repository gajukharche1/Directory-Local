// src/routes/+layout.server.ts
var load = async ({ locals }) => {
	return { user: locals.user ?? null };
};
export { load };

//# sourceMappingURL=_layout.server.ts.js.map