import { defineBackground } from 'wxt/sandbox';

export default defineBackground(() => {
  console.log('Zen Reader Background Initialized');

  // Setup context menu
  chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "open-zen-reader",
      title: "Open in Zen Reader",
      contexts: ["page", "selection"]
    });
  });

  // Handle context menu clicks
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "open-zen-reader" && tab?.id) {
       openReader(tab.id, tab.url);
    }
  });

  // Listen for messages from popup or content script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "openReader" && sender.tab?.id) {
       openReader(sender.tab.id, sender.tab.url);
    }

    // Handle content fetching requests from the Reader UI
    if (message.action === "fetchContent") {
      handleFetchContent(message.url).then(sendResponse);
      return true; // Keep channel open for async response
    }
  });
});

function openReader(tabId: number, url?: string) {
  if (!url) return;

  // Construct the reader URL with the target URL as a query param
  const readerUrl = chrome.runtime.getURL("reader.html") + `?url=${encodeURIComponent(url)}`;

  // Open in a new tab
  chrome.tabs.create({ url: readerUrl });
}

async function handleFetchContent(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();
    return { success: true, html };
  } catch (error) {
    console.error("Fetch failed:", error);
    return { success: false, error: (error as Error).message };
  }
}
