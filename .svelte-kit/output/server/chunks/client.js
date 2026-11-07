import { PrismaClient } from "@prisma/client";
// src/lib/db/client.ts
var globalForPrisma = globalThis;
var db = globalForPrisma.prisma ?? new PrismaClient({ log: process.env.NODE_ENV === "development" ? [
	"query",
	"error",
	"warn"
] : ["error"] });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
export { db as t };

//# sourceMappingURL=client.js.map