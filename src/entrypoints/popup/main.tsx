import React from "react";
import ReactDOM from "react-dom/client";
import { BookOpen, Settings } from "lucide-react";
import "./popup.css";

function Popup() {
  const openReader = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id && tab?.url) {
      // Send message to background to open reader
      chrome.runtime.sendMessage({ action: "openReader", url: tab.url });
      window.close();
    }
  };

  return (
    <div className="w-64 p-4 bg-white dark:bg-gray-900">
      <div className="flex items-center gap-2 mb-4">
        <img
          src="/icon/128.png"
          className="w-8 h-8 rounded"
          alt="Logo"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">Zen Reader</h1>
      </div>

      <button
        onClick={openReader}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors mb-2"
      >
        <BookOpen size={20} />
        Enter Reader Mode
      </button>

      <p className="text-xs text-center text-gray-500 mt-4">
        Distraction-free reading with AI & TTS
      </p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
);
