import * as server from '../entries/pages/(account)/dashboard/reviews/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(account)/dashboard/reviews/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(account)/dashboard/reviews/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.MICp6ZKt.js","_app/immutable/chunks/CFOAJeEN.js","_app/immutable/chunks/B8_9HvXT.js","_app/immutable/chunks/BbJvvMjP.js","_app/immutable/entry/payload.DSmR2FwN.js","_app/immutable/chunks/os7OrWZ7.js","_app/immutable/chunks/BzW6eTQD.js","_app/immutable/chunks/PDOzDFad.js","_app/immutable/chunks/PkuOkCjS.js","_app/immutable/chunks/DfvW2xik.js","_app/immutable/chunks/CwEpdl-B.js"];
export const stylesheets = [];
export const fonts = [];
