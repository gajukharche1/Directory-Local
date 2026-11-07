import * as server from '../entries/pages/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.DYJDNK0w.js","_app/immutable/chunks/CFOAJeEN.js","_app/immutable/chunks/Cuq_spHA.js","_app/immutable/chunks/PDOzDFad.js","_app/immutable/chunks/BmnHG56K.js","_app/immutable/chunks/TzDkW3Kf.js","_app/immutable/chunks/BgG6gdkp.js","_app/immutable/chunks/DSjy95cx.js","_app/immutable/chunks/DHIa8NA7.js","_app/immutable/chunks/bG0Qzg8Z.js","_app/immutable/chunks/BzW6eTQD.js","_app/immutable/chunks/B10s4ySt.js","_app/immutable/chunks/D3GqSDtP.js","_app/immutable/chunks/DA5sAbLe.js"];
export const stylesheets = [];
export const fonts = [];
