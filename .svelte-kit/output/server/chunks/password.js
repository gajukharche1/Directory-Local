import { hash, verify } from "@node-rs/argon2";
// src/lib/auth/password.ts
/**
* OWASP ASVS Level 2 recommended Argon2id parameters
* Memory: 64 MB (65536 KB)
* Iterations (Time cost): 3
* Parallelism (Threads): 1
*/
var ARGON2_OPTIONS = {
	memoryCost: 65536,
	timeCost: 3,
	outputLen: 32,
	parallelism: 1
};
async function hashPassword(password) {
	return await hash(password, ARGON2_OPTIONS);
}
async function verifyPassword(hashString, candidate) {
	try {
		return await verify(hashString, candidate);
	} catch {
		return false;
	}
}
export { verifyPassword as n, hashPassword as t };

//# sourceMappingURL=password.js.map