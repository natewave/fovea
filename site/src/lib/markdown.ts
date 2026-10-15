import { project } from "@fovea/build/project";

const escapeHtml = (text: string): string =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

/** Links in docs/research.md are relative to docs/; on the site they point at the repository. */
export const resolveDocLink = (href: string): string =>
  /^https?:\/\//.test(href) ? href : `${project.repository}/blob/HEAD/docs/${href}`;

const link = (href: string, text: string): string =>
  `<a href="${resolveDocLink(href.replaceAll("&amp;", "&"))}">${text}</a>`;

/** URLs may contain one level of parentheses, as DOIs such as 10.1016/0042-6989(86)90034-9 do. */
const LINK = /\[([^\]]+)\]\(((?:[^()\s]|\([^()\s]*\))+)\)/g;
const AUTOLINK = /&lt;(https?:\/\/[^\s&]+)&gt;/g;

/**
 * Renders the inline Markdown that docs/research.md uses: links, autolinks, code, bold and
 * emphasis. Everything else is escaped.
 */
export const inlineMarkdown = (source: string): string => {
  const codes: string[] = [];
  const withoutCode = escapeHtml(source).replace(/`([^`]+)`/g, (_, code: string) => {
    codes.push(`<code>${code}</code>`);
    return `\uE000${codes.length - 1}\uE001`;
  });
  return withoutCode
    .replace(LINK, (_, text: string, href: string) => link(href, text))
    .replace(AUTOLINK, (_, href: string) => link(href, href))
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\w)/g, "$1<em>$2</em>")
    .replace(/\uE000(\d+)\uE001/g, (_, i: string) => codes[Number(i)] ?? "");
};

/** Plain text without Markdown markup, for counting and labels. */
export const plainText = (source: string): string =>
  source
    .replace(LINK, "$1")
    .replace(/<(https?:\/\/[^>]+)>/g, "$1")
    .replace(/[*`]/g, "");

/** Every absolute URL a Markdown string links to. */
export const linkedUrls = (source: string): readonly string[] => [
  ...[...source.matchAll(LINK)].map((m) => m[2] ?? "").filter((href) => /^https?:/.test(href)),
  ...[...source.matchAll(/<(https?:\/\/[^>\s]+)>/g)].map((m) => m[1] ?? ""),
];
