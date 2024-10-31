import { describe, it, expect } from "vitest";
import { renderBlocks } from "../block-renderer";
import { Block } from "@/types";

describe("renderBlocks", () => {
  it("should handle empty array", () => {
    expect(renderBlocks([])).toBe("");
  });

  it("should render different types of blocks correctly", () => {
    const blocks: Block[] = [
      { id: "1", type: "paragraph", content: "Hello world" },
      { id: "2", type: "heading1", content: "Title" },
      { id: "3", type: "code", content: "console.log('test')" },
      { id: "4", type: "bulletList", content: "List item" },
    ];
    const expected = [
      "<p>Hello world</p>",
      "<h1>Title</h1>",
      "<pre><code>console.log(&#39;test&#39;)</code></pre>",
      "<ul><li>List item</li></ul>",
    ].join("\n");
    expect(renderBlocks(blocks)).toBe(expected);
  });

  it("should escape HTML special characters", () => {
    const blocks: Block[] = [
      { id: "1", type: "paragraph", content: '<script>alert("xss")</script>' },
    ];

    expect(renderBlocks(blocks)).toBe(
      "<p>&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;</p>"
    );
  });
});
