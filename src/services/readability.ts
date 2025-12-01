import { Readability } from "@mozilla/readability";
import type { ExtractedContent } from "./gemini";

export function parseWithReadability(document: Document): ExtractedContent {
  // we clone the document to avoid modifying the live page if run in content script
  // though typically this runs on a constructed DOM
  const reader = new Readability(document.cloneNode(true) as Document);
  const article = reader.parse();

  if (!article) {
    throw new Error("Readability failed to parse the document");
  }

  return {
    title: article.title,
    content: article.content,
    byline: article.byline,
    excerpt: article.excerpt,
  };
}
