import * as server from '../entries/pages/(public)/pricing/_page.server.ts.js';

export const index = 22;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(public)/pricing/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(public)/pricing/+page.server.ts";
export const imports = ["_app/immutable/nodes/22.CPcyXV66.js","_app/immutable/chunks/CFOAJeEN.js","_app/immutable/chunks/B3C4heKt.js","_app/immutable/chunks/PDOzDFad.js","_app/immutable/chunks/BgG6gdkp.js"];
export const stylesheets = [];
export const fonts = [];
