/**
 * Zero-dependency robust HTML sanitizer and stripper.
 * Eliminates the CommonJS/ESM 'require() of ES Module htmlparser2' runtime crash on Vercel.
 */

const DANGEROUS_BLOCKS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
  /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
];

const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "blockquote",
  "a",
]);

/**
 * Sanitizes rich-text user input against XSS vectors before database writes.
 */
export function sanitizeRichText(dirty: string): string {
  if (!dirty) return "";

  let clean = dirty;

  // 1. Remove dangerous blocks completely
  for (const block of DANGEROUS_BLOCKS) {
    clean = clean.replace(block, "");
  }

  // 2. Remove inline event handlers (e.g. onclick, onload, onerror)
  clean = clean.replace(/\s*on[a-z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, "");

  // 3. Remove javascript: or data: URIs in href/src
  clean = clean.replace(
    /(href|src)\s*=\s*(?:'javascript:[^']*'|"javascript:[^"]*"|'data:[^']*'|"data:[^"]*")/gi,
    '$1="#"'
  );

  // 4. Parse and filter tags
  clean = clean.replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (match, tag, attrs) => {
    const lowerTag = tag.toLowerCase();
    if (!ALLOWED_TAGS.has(lowerTag)) return "";

    if (match.startsWith("</")) return `</${lowerTag}>`;
    if (lowerTag === "br") return "<br />";

    if (lowerTag === "a") {
      const hrefMatch = attrs.match(/href\s*=\s*(?:'([^']*)'|"([^"]*)"|([^\s>]+))/i);
      const rawHref = (hrefMatch ? (hrefMatch[1] || hrefMatch[2] || hrefMatch[3]) : "#") || "#";
      const isSafe =
        /^https?:\/\//i.test(rawHref) ||
        /^mailto:/i.test(rawHref) ||
        /^tel:/i.test(rawHref) ||
        rawHref.startsWith("/");
      const safeHref = isSafe ? rawHref : "#";
      return `<a href="${safeHref}" target="_blank" rel="nofollow noopener noreferrer">`;
    }

    return `<${lowerTag}>`;
  });

  return clean.trim();
}

/**
 * Strips all HTML tags entirely for plain-text fields (e.g. titles, reviews, comments).
 */
export function stripHtml(dirty: string): string {
  if (!dirty) return "";

  let clean = dirty;
  for (const block of DANGEROUS_BLOCKS) {
    clean = clean.replace(block, " ");
  }

  return clean
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}
