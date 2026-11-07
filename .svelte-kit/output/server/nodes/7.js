import * as server from '../entries/pages/(account)/dashboard/billing/_page.server.ts.js';

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(account)/dashboard/billing/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(account)/dashboard/billing/+page.server.ts";
export const imports = ["_app/immutable/nodes/7.8GEP16zQ.js","_app/immutable/chunks/CFOAJeEN.js","_app/immutable/chunks/z6VdaftL.js","_app/immutable/chunks/PDOzDFad.js","_app/immutable/chunks/BgG6gdkp.js","_app/immutable/chunks/DfvW2xik.js"];
export const stylesheets = [];
export const fonts = [];
