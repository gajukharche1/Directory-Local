import * as server from '../entries/pages/(account)/dashboard/_page.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(account)/dashboard/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(account)/dashboard/+page.server.ts";
export const imports = ["_app/immutable/nodes/6.TKLNp983.js","_app/immutable/chunks/CFOAJeEN.js","_app/immutable/chunks/DV_Z4oyn.js","_app/immutable/chunks/PDOzDFad.js","_app/immutable/chunks/jooYJbOQ.js","_app/immutable/chunks/BzW6eTQD.js","_app/immutable/chunks/TzDkW3Kf.js","_app/immutable/chunks/BgG6gdkp.js","_app/immutable/chunks/Ba_O4wH0.js"];
export const stylesheets = [];
export const fonts = [];
