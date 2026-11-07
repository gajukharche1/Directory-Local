import * as server from '../entries/pages/(account)/dashboard/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(account)/dashboard/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/(account)/dashboard/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.D-0cmDic.js","_app/immutable/chunks/CFOAJeEN.js","_app/immutable/chunks/os7OrWZ7.js","_app/immutable/entry/payload.DSmR2FwN.js","_app/immutable/chunks/2CINCM1L.js","_app/immutable/chunks/PDOzDFad.js","_app/immutable/chunks/DV_Z4oyn.js","_app/immutable/chunks/jooYJbOQ.js","_app/immutable/chunks/BzW6eTQD.js","_app/immutable/chunks/z6VdaftL.js","_app/immutable/chunks/Db9bASHJ.js","_app/immutable/chunks/NEf5c4oT.js"];
export const stylesheets = [];
export const fonts = [];
