import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom/client";
import { ReaderControls } from "@/components/ReaderControls";
import { SettingsModal } from "@/components/SettingsModal";
import { GeminiService, type ExtractedContent } from "@/services/gemini";
import { settingsStorage, type ReaderSettings } from "@/utils/storage";
import { Settings, AlertCircle, Loader2 } from "lucide-react";
import DOMPurify from "dompurify";
import "@/assets/reader.css"; // We'll create this next

function ReaderApp() {
  const [content, setContent] = useState<ExtractedContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<ReaderSettings | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load initial settings
    settingsStorage.getValue().then((s) => {
      setSettings(s);

      // Load content once settings are ready (we might need API key)
      const params = new URLSearchParams(window.location.search);
      const url = params.get("url");
      if (url) {
        loadContent(url, s.geminiApiKey);
      } else {
        setError("No URL provided to read.");
        setLoading(false);
      }
    });

    // Watch for theme changes to apply to body
    const unwatch = settingsStorage.watch((newSettings) => {
      setSettings(newSettings);
      applyTheme(newSettings);
    });
    return () => unwatch();
  }, []);

  const applyTheme = (s: ReaderSettings) => {
    if (s.theme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = "#1a1a1a";
      document.body.style.color = "#e5e5e5";
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "#ffffff";
      document.body.style.color = "#1a1a1a";
    }

    if (contentRef.current) {
      contentRef.current.style.fontFamily = s.fontFamily;
      contentRef.current.style.fontSize = `${s.fontSize}px`;
      contentRef.current.style.lineHeight = `${s.lineHeight}`;
    }
  };

  const loadContent = async (url: string, apiKey: string) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Fetch content via Background Script (bypasses CORS)
      let html = "";
      try {
        const response = await new Promise<{success: boolean, html?: string, error?: string}>((resolve) => {
          chrome.runtime.sendMessage({ action: "fetchContent", url }, resolve);
        });

        if (!response.success || !response.html) {
          throw new Error(response.error || "Failed to fetch content");
        }
        html = response.html;
      } catch (e) {
        console.warn("Background fetch failed:", e);
        throw new Error("Cannot access page content. Ensure the page is accessible.");
      }

      // 2. Try Gemini if Key exists
      if (apiKey) {
        try {
          const gemini = new GeminiService(apiKey);
          const result = await gemini.extractContent(html, url);
          setContent(result);
          setLoading(false);
          return;
        } catch (geminiError) {
          console.error("Gemini failed, falling back to Readability", geminiError);
        }
      }

      // 3. Fallback to Readability (Server-side/Local logic simulation)
      // Since Readability requires a DOM, we parse the string
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const { parseWithReadability } = await import("@/services/readability");
      const result = parseWithReadability(doc);

      setContent(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
        <p className="text-gray-500">Extracting content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-8 text-center">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h2 className="text-xl font-bold mb-2">Extraction Failed</h2>
        <p className="text-gray-600 mb-6 max-w-md">{error}</p>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Check Settings
        </button>
        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative pb-32">
      {/* Header / Meta */}
      <div className="max-w-3xl mx-auto pt-12 px-6 mb-8">
        <div className="flex justify-between items-start mb-6">
          <button
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            ← Back
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Settings size={20} />
          </button>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100 leading-tight">
          {content?.title}
        </h1>
        {content?.byline && (
          <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">{content.byline}</p>
        )}
      </div>

      {/* Main Content */}
      <div
        ref={contentRef}
        className="max-w-3xl mx-auto px-6 content-area"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(content?.content || ""),
        }}
      />

      {/* Controls */}
      <ReaderControls contentRef={contentRef} fullText={contentRef.current?.textContent || ""} />

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ReaderApp />
  </React.StrictMode>,
);
