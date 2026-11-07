export function cn(...inputs: (string | boolean | undefined | null)[]): string {
  return inputs.filter(Boolean).join(" ");
}

/**
 * Deeply transforms Prisma objects (Decimals, BigInts) into standard POJOs
 * so SvelteKit's devalue serializer can serialize load data to the client.
 */
export function toPOJO<T>(data: T): T {
  if (data === null || data === undefined) return data;
  if (typeof data === "bigint") return Number(data) as unknown as T;
  if (typeof data === "object") {
    if ("toNumber" in data && typeof (data as any).toNumber === "function") {
      return (data as any).toNumber();
    }
    if (data instanceof Date) return data;
    if (Array.isArray(data)) {
      return data.map(toPOJO) as unknown as T;
    }
    const copy: any = {};
    for (const key of Object.keys(data)) {
      copy[key] = toPOJO((data as any)[key]);
    }
    return copy;
  }
  return data;
}
