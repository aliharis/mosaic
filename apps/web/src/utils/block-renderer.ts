import { Block } from "@/types";

export function renderBlocks(blocks: Block[]): string {
  const transformSingleBlock = (block: Block): string => {
    const escapedContent = escapeHtml(block.content);

    switch (block.type) {
      case "paragraph":
        return `<p>${escapedContent}</p>`;
      case "heading1":
        return `<h1>${escapedContent}</h1>`;
      case "heading2":
        return `<h2>${escapedContent}</h2>`;
      case "heading3":
        return `<h3>${escapedContent}</h3>`;
      case "bulletList":
        return `<ul><li>${escapedContent}</li></ul>`;
      case "numberedList":
        return `<ol><li>${escapedContent}</li></ol>`;
      case "quote":
        return `<blockquote>${escapedContent}</blockquote>`;
      case "code":
        return `<pre><code>${escapedContent}</code></pre>`;
      default:
        return escapedContent;
    }
  };

  // Handle empty array
  if (blocks.length === 0) return "";

  // Transform all blocks and join them
  return blocks.map(transformSingleBlock).join("\n");
}

// Helper function to escape HTML special characters
function escapeHtml(text: string): string {
  const htmlEntities: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  return text.replace(/[&<>"']/g, (char) => htmlEntities[char]);
}
