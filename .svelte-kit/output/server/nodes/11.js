import * as server from '../entries/pages/(admin)/admin/_page.server.ts.js';

export const index = 11;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(admin)/admin/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(admin)/admin/+page.server.ts";
export const imports = ["_app/immutable/nodes/11.Fvw5ZKj9.js","_app/immutable/chunks/CFOAJeEN.js","_app/immutable/chunks/DV_Z4oyn.js","_app/immutable/chunks/PDOzDFad.js","_app/immutable/chunks/BzW6eTQD.js","_app/immutable/chunks/waYVTNAs.js","_app/immutable/chunks/BNA2vdAd.js","_app/immutable/chunks/TzDkW3Kf.js"];
export const stylesheets = [];
export const fonts = [];
