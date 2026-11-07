import * as server from '../entries/pages/(admin)/admin/imports/_page.server.ts.js';

export const index = 12;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(admin)/admin/imports/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(admin)/admin/imports/+page.server.ts";
export const imports = ["_app/immutable/nodes/12.xmxFXfoo.js","_app/immutable/chunks/CFOAJeEN.js","_app/immutable/chunks/B8_9HvXT.js","_app/immutable/chunks/BbJvvMjP.js","_app/immutable/entry/payload.DSmR2FwN.js","_app/immutable/chunks/os7OrWZ7.js","_app/immutable/chunks/Dm9B6nOL.js","_app/immutable/chunks/PDOzDFad.js","_app/immutable/chunks/-RcOH4B7.js","_app/immutable/chunks/Cs1xh3QT.js","_app/immutable/chunks/CwEpdl-B.js","_app/immutable/chunks/D1bSDA6R.js"];
export const stylesheets = [];
export const fonts = [];
