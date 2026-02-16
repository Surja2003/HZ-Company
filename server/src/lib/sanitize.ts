import sanitizeHtml from "sanitize-html";

export function sanitizePlainText(input: string) {
  const stripped = sanitizeHtml(input, { allowedTags: [], allowedAttributes: {} });
  return stripped.replace(/\s+/g, " ").trim();
}
