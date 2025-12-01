import { defineContentScript } from "wxt/sandbox";
import { parseWithReadability } from "@/services/readability";

export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    console.log("Zen Reader Content Script Active");

    // Listen for requests to extract content
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === "extractContentLocal") {
        try {
          const content = parseWithReadability(document);
          sendResponse({ success: true, content });
        } catch (error) {
          sendResponse({ success: false, error: (error as Error).message });
        }
      }
    });
  },
});
