import * as server from '../entries/pages/(admin)/admin/_layout.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(admin)/admin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/(admin)/admin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/3.DikLqjD9.js","_app/immutable/chunks/CFOAJeEN.js","_app/immutable/chunks/os7OrWZ7.js","_app/immutable/entry/payload.DSmR2FwN.js","_app/immutable/chunks/2CINCM1L.js","_app/immutable/chunks/PDOzDFad.js","_app/immutable/chunks/BNA2vdAd.js","_app/immutable/chunks/DV_Z4oyn.js","_app/immutable/chunks/NEf5c4oT.js","_app/immutable/chunks/Db9bASHJ.js"];
export const stylesheets = [];
export const fonts = [];
