import { redirect } from "@sveltejs/kit";
import { UserRole } from "@prisma/client";
// src/lib/auth/rbac.ts
var ROLE_RANK = {
	visitor: 1,
	owner: 2,
	moderator: 3,
	admin: 4
};
function hasRole(userRole, targetRole) {
	return ROLE_RANK[userRole] >= ROLE_RANK[targetRole];
}
// src/routes/(admin)/admin/+layout.server.ts
var load = async ({ locals }) => {
	if (!locals.user || !hasRole(locals.user.role, UserRole.moderator)) throw redirect(303, "/login?redirectTo=/admin");
	return { user: locals.user };
};
export { load };

//# sourceMappingURL=_layout.server.ts.js.map