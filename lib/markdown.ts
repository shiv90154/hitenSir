/**
 * Minimal, dependency-free Markdown-lite renderer for long-form content
 * (blog posts, guides). Supports headings, bold/italic, links, and lists —
 * enough to break up a wall of text without pulling in a full editor/parser.
 * All input is HTML-escaped up front, so the only markup that can reach the
 * page is what this function generates itself — safe to render with
 * dangerouslySetInnerHTML.
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderInline(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>");
}

export function renderMarkdownLite(source: string): string {
  const escaped = escapeHtml(source);
  const lines = escaped.split(/\r?\n/);

  const html: string[] = [];
  let listBuffer: string[] = [];

  function flushList() {
    if (listBuffer.length > 0) {
      html.push(`<ul>${listBuffer.join("")}</ul>`);
      listBuffer = [];
    }
  }

  let paragraphBuffer: string[] = [];
  function flushParagraph() {
    if (paragraphBuffer.length > 0) {
      html.push(`<p>${renderInline(paragraphBuffer.join(" "))}</p>`);
      paragraphBuffer = [];
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line === "") {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = /^(#{1,3})\s+(.*)$/.exec(line);
    if (heading) {
      flushParagraph();
      flushList();
      const level = heading[1].length + 1; // h1 reserved for the page title
      html.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      continue;
    }

    const listItem = /^[-*]\s+(.*)$/.exec(line);
    if (listItem) {
      flushParagraph();
      listBuffer.push(`<li>${renderInline(listItem[1])}</li>`);
      continue;
    }

    flushList();
    paragraphBuffer.push(line);
  }

  flushParagraph();
  flushList();

  return html.join("\n");
}
